import Redis from "@ioc:Adonis/Addons/Redis";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Aula from "App/Models/Aula";
import Caderno from "App/Models/Caderno";
import Questao from "App/Models/Questao";
import Respondida from "App/Models/Respondida";
import { QuestionHelper } from "App/repositories/QuestionHelper";
import { DateTime } from "luxon";
import fs from "fs/promises";

export default class QuestionsController {
  async index({ request, params }: HttpContextContract) {
    const { aula_id } = params;
    const { page, perPage = 10, withAulas, withRespondidas } = request.qs();

    const query = Questao.query()
      .if(aula_id, (q) => {
        q.whereIn(
          "id",
          Database.from("aula_questao")
            .select("questao_id")
            .where("aula_id", aula_id)
        );
      })
      .if(withAulas, (q) => q.preload("aulas"))
      .if(withRespondidas, (q) => q.preload("respondidas"));

    if (page) {
      return query.paginate(page, perPage);
    }

    return await query;
  }

  async show({ request, params }: HttpContextContract) {
    const { withAulas, withRespondidas } = request.qs();

    return Questao.query()
      .where("id", params.id)
      .if(withAulas, (q) => q.preload("aulas"))
      .if(withRespondidas, (q) => q.preload("respondidas"))
      .first();
  }

  async update({ request, params }: HttpContextContract) {
    const { enunciado, alternativas, gabarito } = request.all();

    const questao = await Questao.findOrFail(params.id);
    questao.merge({
      enunciado,
      gabarito,
      alternativas: JSON.stringify(
        alternativas.length <= 1 ? ["Certo", "Errado"] : alternativas
      ),
    });

    await questao.save();

    return questao;
  }

  async store({request, params}: HttpContextContract) {
    const data = request.only(['gabarito', 'enunciado', 'alternativas', 'modalidade'])
    const { aula_id } = params

    const questao = await Questao.create({...data, aula_id, alternativas: JSON.stringify(data.alternativas)})

    await questao.related('aulas').attach([aula_id])

    return questao;
  }

  async prepareFromFile({ request, response }: HttpContextContract) {
    const file = request.file("file");
    const { aula_id } = request.all()

    if (!file?.tmpPath) {
      return response.json({ error: "FILE INVALID" });
    }
    try {
      const dataText = (await fs.readFile(file?.tmpPath)).toString();

      if(this._isJson(dataText)) {
        return this._extractFromJSON(dataText, aula_id)
      } else {
        return this._extractFromMarkdown(dataText, aula_id);
      }

    } catch (error:any) {
      return response.json({ error: "ERROR PARSER", message: error.message });
    }
  }

  async editarEmLote({ request }: HttpContextContract) {
    const markdown = request.input("markdown");
    const aula_id = request.input("aula_id");

    const aula = await Aula.findOrFail(aula_id);

    const questoes = markdown.split("****").map((mdQuestao) => {
      const partes = mdQuestao.split("***");
      const _gabarito = partes.pop();

      const [_enunciado, ..._alternativas] = partes;

      const idRegex = /^\[ID: ?(\d{1,11})\]/;
      const matchId = _enunciado.trim().match(idRegex);

      const questaoId = matchId ? matchId[1] : undefined;

      const enunciado = _enunciado.trim().replace(idRegex, "");
      const alternativas = JSON.stringify(
        _alternativas.length === 0
          ? ["Certo", "Errado"]
          : _alternativas.map((alt) => alt.trim())
      );
      const gabarito = _gabarito.trim();
      const modalidade =
        alternativas.length > 2 ? "MULTIPLA_ESCOLHA" : "CERTO_ERRADO";

      return {
        enunciado,
        id: questaoId,
        alternativas,
        gabarito,
        modalidade,
        aula_id,
      };
    });

    return await Database.transaction(async () => {
      const news = await aula
        .related("questoes")
        .createMany(questoes.filter((it) => !it?.id));
      const updated = await Questao.updateOrCreateMany(
        "id",
        questoes.filter((it) => !!it?.id)
      );

      return [...news, ...updated];
    });
  }

  async editar({ params, request }: HttpContextContract) {
    const { id, questao } = params;
    const { texto = "" } = request.only(["texto"]);

    const aula = await Aula.find(id);

    QuestionHelper.edit(aula?.markdown, questao, texto);
  }

  async text({ params }: HttpContextContract) {
    const { id, questao } = params;

    const aula = await Aula.find(id);

    const text = QuestionHelper.text(aula?.markdown, questao);

    return { text };
  }

  async responder({ request, user, logger }: HttpContextContract) {
    const today = DateTime.local().set({ hour: 0, minute: 0, second: 0 });
    try {
      const redisTodayKey = `dashboard:${user?.id}:>=${today.toSQLDate()}`;
      await Redis.del(redisTodayKey);
    } catch (e) {
      logger.error("redis indisponível");
    }

    const { questao_id, resposta, caderno_id } = request.all();

    const questao = await Questao.query().where("id", questao_id).firstOrFail();

    const caderno = await Caderno.findOrFail(caderno_id);

    const aula = await Aula.findOrFail(caderno.aula_id);

    return Database.transaction(async () => {
      const respondida = await Respondida.create({
        questao_id,
        resposta,
        caderno_id,
        aula_id: questao.aula_id,
        acertou: questao.gabarito === "X" || questao.gabarito === resposta,
        gabarito: questao.gabarito,
        horario: DateTime.local(),
        user_id: user?.id || 0,
      });

      const respondidas = await Respondida.query().where(
        "caderno_id",
        caderno_id
      );

      const questoes = await aula.related("questoes").query();

      caderno.encerrado = respondidas.length === questoes.length;
      caderno.acertos = respondidas.filter((r) => r.acertou).length;
      caderno.erros = respondidas.filter((r) => !r.acertou).length;
      caderno.total = questoes.length;

      if (respondidas.length === 1) {
        caderno.inicio = DateTime.local();
      }

      if (respondidas.length === questoes.length) {
        caderno.fim = DateTime.local();
      }

      await caderno.save();

      return respondida;
    });
  }

  async deleteRespondida({ params }: HttpContextContract) {
    const { id } = params;

    await Respondida.query().where("id", id).delete();

    return "ok";
  }

  async respondidas({ params, user }: HttpContextContract) {
    const { aula, questao } = params;

    const respondida = await Respondida.query()
      .where("user_id", user?.id || "")
      .where("aula_id", aula)
      .if(questao, (q) => q.where("questao_id", questao));

    return respondida;
  }

  async destroy({ params }: HttpContextContract) {
    return await Database.transaction(async (trx) => {
      const questao = await Questao.findOrFail(params.id);

      await trx.from("aula_questao").where("questao_id", params.id).delete();

      return await questao.delete();
    });
  }

  _extractFromMarkdown(texto: string, aula_id: any): Questao[] {
    const questoes = texto
      .toString()
      .split("****")
      .map((item) => {
        const questao = new Questao();

        const partes = item.split("***");

        questao.gabarito = partes.pop()?.trim().replace(/\n/g, "") || "X";
        const [enunciado, ...alternativas] = partes;
        const modalidade =
          alternativas.length > 2 ? "MULTIPLA_ESCOLHA" : "CERTO_ERRADO";

        questao.enunciado = enunciado.replace(/^\n/, "");
        questao.alternativas =
          alternativas.length === 0 ? ["Certo", "Errado"] : alternativas;
        questao.modalidade = modalidade;
        questao.aula_id = aula_id

        return questao;
      });

    return questoes;
  }

  _extractFromJSON(texto: string, aula_id: any): Questao[] {
    const json:any = JSON.parse(texto);


    const questoes = json?.data?.map((item: any) => {

      const questao = new Questao()

      let [ano, banca, orgao, cargo] = ['', '', '', '']

      if(item?.exams?.length > 0) {
        const [exam] = item.exams;

        if(exam?.catalogs) {
          const {jury_id, institution_id, role_id } = exam.catalogs;

          banca = jury_id?.name
          orgao = institution_id?.name
          cargo = role_id?.name
        }

        ano = exam.year
      }

      questao.enunciado = `(${banca} - ${ano} - ${orgao} - ${cargo}) ${item?.statement}`;
      questao.alternativas = item?.alternatives?.map((alternativa:any, index: number) => {

        const letrasAE = ["A", "B", "C", "D", "E"]
        const letrasCE = ["C", "E"]

        if(alternativa?.correct) {
          questao.gabarito = item.alternatives.length === 2 ? letrasCE[index] : letrasAE[index]
        }

        return alternativa?.body
      })

      questao.aula_id = aula_id

      return questao;

    })

    return questoes;
  }

  _isJson(texto: string): boolean {
    try {
      JSON.parse(texto);
    } catch (error) {
      return false;
    }

    return true;
  }

}
