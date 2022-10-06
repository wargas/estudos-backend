import Redis from "@ioc:Adonis/Addons/Redis";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Aula from "App/Models/Aula";
import Questao from "App/Models/Questao";
import Respondida from "App/Models/Respondida";
import { QuestionHelper } from "App/repositories/QuestionHelper";
import { DateTime } from "luxon";
import fs from "fs/promises";

export default class QuestionsController {
  async index({ request, params }: HttpContextContract) {
    const { aula_id, caderno_id } = params;
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
      .if(caderno_id, q => {
        q.whereIn(
          "id", Database.from('caderno_questao')
            .select('questao_id')
            .where('caderno_id', caderno_id)
        )
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
    const { enunciado, alternativas, gabarito, resolucao } = request.all();

    const questao = await Questao.findOrFail(params.id);
    questao.merge({
      enunciado,
      gabarito,
      resolucao,
      alternativas: JSON.stringify(
        alternativas.length <= 1 ? ["Certo", "Errado"] : alternativas
      ),
    });

    await questao.save();

    return questao;
  }

  async store({ request, params }: HttpContextContract) {
    const { comentario, ...data } = request.only(['gabarito', 'enunciado', 'alternativas', 'modalidade', 'comentario', 'resolucao'])
    const { aula_id } = params

    const questao = await Questao.create({ ...data, aula_id, alternativas: JSON.stringify(data.alternativas) })

    await questao.related('aulas').attach([aula_id])

    if (comentario) {
      questao.related('comentarios').create({
        texto: comentario.texto
      })
    }

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

      if (this._isJson(dataText)) {
        return this._extractFromJSON(dataText, aula_id)
      } else {

        if (this._isMarkdown(dataText)) {
          return this._extractFromMarkdown(dataText, aula_id);
        } else {
          return this._extractFromText(dataText, aula_id)
        }
      }

    } catch (error: any) {
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

    const { questao_id, resposta, caderno_id, aula_id } = request.all();
    const questao = await Questao.query().where("id", questao_id).firstOrFail();


    const respondida = await Respondida.create({
      questao_id,
      resposta,
      caderno_id,
      aula_id: aula_id,
      acertou: questao.gabarito === "X" || questao.gabarito === resposta,
      gabarito: questao.gabarito,
      horario: DateTime.local(),
      user_id: user?.id || 0,
    });



    return respondida;
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
      await trx.from("caderno_questao").where("questao_id", params.id).delete();
      await trx.from("respondidas").where("questao_id", params.id).update({
        caderno_id: 0,
        aula_id: 0
      })

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

        questao.gabarito = partes.pop()?.trim()?.replace(/\n/g, "") || "X";
        const [enunciado, ...alternativas] = partes;
        const modalidade =
          alternativas.length > 2 ? "MULTIPLA_ESCOLHA" : "CERTO_ERRADO";

        questao.enunciado = enunciado?.replace(/^\n/, "");
        questao.alternativas =
          alternativas.length === 0 ? ["Certo", "Errado"] : alternativas;
        questao.modalidade = modalidade;
        questao.aula_id = aula_id

        return questao;
      });

    return questoes;
  }

  _extractFromJSON(texto: string, aula_id: any): NewQuestao[] {
    const json: any = JSON.parse(texto);

    const questoes = json?.data?.map((item: any) => {

      const questao = new Questao()

      let [ano, banca, orgao, cargo] = ['', '', '', '']

      if (item?.exams?.length > 0) {
        const [exam] = item.exams;

        if (exam?.catalogs) {
          const { jury_id, institution_id, role_id } = exam.catalogs;

          banca = jury_id?.name
          orgao = institution_id?.name
          cargo = role_id?.name
        }

        ano = exam.year
      }



      questao.enunciado = `(${banca} - ${ano} - ${orgao} - ${cargo}) ${item?.statement}`;
      questao.resolucao = item?.solution?.brief || ''
      questao.alternativas = item?.alternatives?.map((alternativa: any, index: number) => {

        const letrasAE = ["A", "B", "C", "D", "E"]
        const letrasCE = ["C", "E"]

        if (alternativa?.correct) {
          questao.gabarito = item.alternatives.length === 2 ? letrasCE[index] : letrasAE[index]
        }

        return alternativa?.body
      })

      questao.aula_id = aula_id

      return { ...questao.serialize() };

    })

    return questoes;
  }

  _extractFromText(_texto: string, aula_id: any): Questao[] {

    const texto = _texto.split('---').map((split: string, index: number) => {
      if (index % 2 === 1) {
        return `[comentario]${Buffer.from(split, 'utf-8').toString('base64')}`
      }
      return split
    }).join('')


    const [conteudoText, gabaritoText] = texto.split('GABARITO');
    

    if (!conteudoText || !gabaritoText) {
      throw new Error("ERROR: TEXTO INVALIDO");
    }

    const gabaritos = gabaritoText.split("\n")
      .filter(l => l.match(/\d+\. \w/))
      .map(l => l.trim()
        .replace(/ (ALTERNATIVA|LETRA) /i, " ")
        .replace(/(\d+\.\s)(\w)(ORRETA|RRADA|ORRETO|RRADO)/i, "$1$2"))
      .map(gab => gab.slice(-1))

    const ids = conteudoText.split('\n')
      .find(l => l.startsWith('[UPDATE]'))?.replace('[UPDATE]', '')
      .split(',')

    console.log(ids)

    const questions = conteudoText.replace(/\d{1,3}\. \(/g, "@@@(")
      .replace(/(\n|\s)\(?[a-eA-E]\) /gi, "\n***\n")
      .split('@@@').slice(1)
    
    if(ids !== undefined && ids.length !== questions.length) {
      throw new Error(`ERROR: IDS: ${ids.length}; QUESTOES: ${gabaritos.length}`);
    }

    if (gabaritos.length !== questions.length) {
      throw new Error(`ERROR: QUESTOES: ${questions.length}; GABARITOS: ${gabaritos.length}`);
    }

    return questions.map((questionText, index) => {
      const question = new Questao()

      const [enunciado, ...alternativas] = questionText
        .split('\n')
        .filter(l => !l.startsWith('[comentario]'))
        .join('\n')
        .split('***')

      const resolucao64 = questionText.split('\n').find(l => l.startsWith('[comentario]')) || ''
      
      if(ids !== undefined) {
        try {
          question.id = parseInt(ids[index])
        } catch(e) {

        }
      }
      
      question.resolucao = Buffer.from(resolucao64.replace('[comentario]', ''), 'base64').toString('utf-8')

      question.enunciado = enunciado
      question.gabarito = gabaritos[index]
      question.alternativas = alternativas.length === 0 ? ["Certo", "Errado"] : alternativas,
        question.aula_id = aula_id
      question.modalidade = alternativas.length > 2 ? "MULTIPLA_ESCOLHA" : "CERTO_ERRADO";

      return question;
    })
  }

  _isJson(texto: string): boolean {
    try {
      JSON.parse(texto);
    } catch (error) {
      return false;
    }

    return true;
  }

  _isMarkdown(texto: string): boolean {
    return texto.split('****').length > 1
  }


}

type NewQuestao = {
  comentario?: {
    texto: string
  }
} & Questao
