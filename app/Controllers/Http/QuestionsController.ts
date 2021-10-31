import Redis from '@ioc:Adonis/Addons/Redis';
import Env from '@ioc:Adonis/Core/Env';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import Aula from 'App/Models/Aula';
import Questao from 'App/Models/Questao';
import Respondida from 'App/Models/Respondida';
import { ExtractQuestions } from 'App/repositories/ExtractQuestions';
import { DateTime } from 'luxon';




export default class QuestionsController {

  async index({request}: HttpContextContract) {
    
    const query = Questao.query()
      .if(request.input('id'), q => {
        q.where('id', request.input('id'))
      })
      .if(request.input('aula_id'), q => {
        q.where('aula_id', request.input('aula_id'))
      }).limit(500)

    return await query;
  }

  async show(ctx: HttpContextContract) {
    return Questao.query()
      .preload('respondidas')
      .where('id', ctx.params.id)
      .first()
  }

  async editarEmLote({request}: HttpContextContract) {

    const markdown = request.input('markdown')
    const aula_id = request.input('aula_id')

    const questoes = markdown.split('****').map(mdQuestao => {
      const partes = mdQuestao.split('***');
      const _gabarito = partes.pop()

      const [_enunciado, ..._alternativas] = partes

      const idRegex = /^\[ID: ?(\d{1,11})\]/
      const matchId = _enunciado.trim().match(idRegex)

      const questaoId = matchId ? matchId[1] : undefined

      const enunciado = _enunciado.trim().replace(idRegex, "")
      const alternativas = JSON.stringify(
        _alternativas.length === 0 ? ['Certo', 'Errado'] : _alternativas.map(alt => alt.trim()))
      const gabarito = _gabarito.trim()
      const modalidade = alternativas.length > 2 ? 'MULTIPLA_ESCOLHA' : 'CERTO_ERRADO'

      return {enunciado, id: questaoId, alternativas, gabarito, modalidade, aula_id}
    })

    return await Promise.all([
      Questao.createMany(questoes.filter(it => !it?.id)),
      Questao.updateOrCreateMany('id', questoes.filter(it => !!it?.id))
    ])
  }

  async editar({ params, request }: HttpContextContract) {

    const { id, questao } = params;
    const { texto = "" } = request.only(["texto"]);

    const aula = await Aula.find(id);

    ExtractQuestions.edit(aula?.markdown, questao, texto);
  }

  async text({ params }: HttpContextContract) {
    const { id, questao } = params;

    const aula = await Aula.find(id);

    const text = ExtractQuestions.text(aula?.markdown, questao);

    return { text };
  }

  async responder({ request, user }: HttpContextContract) {
    const today = DateTime.local().set({ hour: 0, minute: 0, second: 0 })
    const redisTodayKey = `dashboard:${user?.id}:>=${today.toSQLDate()}`
    await Redis.del(redisTodayKey)
    
    const { questao_id, resposta } = request.all();

    const questao = await Questao.query()
      .where('id', questao_id)
      .firstOrFail()

    const respondida = await Respondida.create({
      questao_id,
      resposta,
      aula_id: questao.aula_id,
      acertou: questao.gabarito === resposta,
      gabarito: questao.gabarito,
      horario: DateTime.local(),
      user_id: user?.id || 0 
    })

    return respondida;
  }

  async deleteRespondida({ params}: HttpContextContract ) {
    const { id } = params;

    await Respondida.query().where('id', id).delete();

    return 'ok';
  }

  async respondidas({ params, user }: HttpContextContract) {
    const { aula } = params;

    const respondida = await Respondida.query()
      .where("user_id", user?.id || '')
      .where('aula_id', aula);


    return respondida;

  }

  async upload({ request }: HttpContextContract) {
    const image = request.file('image');


    await image?.move(`${Env.get('UPLOAD_ROOT')}`, {
      name: `image-${DateTime.local().toMillis()}.${image.extname}`
    })

    return { ...image?.toJSON(), filePath: undefined, clientName: undefined }

  }

  async erros({params}: HttpContextContract) {
    const { dia } = params;

    let aula = await Aula.query().where('markdown', `${dia}.md`).first();

    if(!aula) {
      aula = await Aula.create({
        name: `Erros do dia ${dia}`,
        disciplina_id: 54,
        markdown: `${dia}.md`,
        user_id: 1,
        ordem: 0,
        concurso_id: 1
      })
    }

    const [questoes] = await Database.rawQuery(`
      SELECT questao, aula_id, aulas.markdown
        FROM respondidas
        INNER JOIN aulas ON respondidas.aula_id = aulas.id
        where DATE(horario) = DATE('${dia}') AND acertou = 0
    `)

    const texto = questoes.map(questao => {
      return ExtractQuestions.text(questao.markdown, parseInt(questao.questao));
    }).join("****");

    await ExtractQuestions.makeFile(`${dia}.md`, texto);

    return aula;

  }
}
