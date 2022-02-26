import Redis from '@ioc:Adonis/Addons/Redis';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import Aula from 'App/Models/Aula';
import Questao from 'App/Models/Questao';
import Respondida from 'App/Models/Respondida';
import { QuestionHelper } from 'App/repositories/QuestionHelper';
import { DateTime } from 'luxon';

export default class QuestionsController {

  async index({ request, params }: HttpContextContract) {

    const { aula_id } = params;
    const { page, perPage = 10, withAulas } = request.qs()

    const query = Questao.query()
      .if(aula_id, q => {
        q.where('aula_id', aula_id)
      })
      .if(withAulas, q => q.preload('aulas'))

    if (page) {
      return query.paginate(page, perPage)
    }

    return await query;
  }

  async show({ request, params }: HttpContextContract) {
    const { withAulas, withRespondidas } = request.qs()

    return Questao.query()
      .where('id', params.id)
      .if(withAulas, q => q.preload('aulas'))
      .if(withRespondidas, q => q.preload('respondidas'))
      .first()
  }

  async editarEmLote({ request }: HttpContextContract) {

    const markdown = request.input('markdown')
    const aula_id = request.input('aula_id')

    const aula = await Aula.findOrFail(aula_id)

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

      return { enunciado, id: questaoId, alternativas, gabarito, modalidade, aula_id }
    })

    return await Database.transaction(async () => {
      const news = await aula.related('questoes').createMany(questoes.filter(it => !it?.id))
      const updated = await Questao.updateOrCreateMany('id', questoes.filter(it => !!it?.id))

      return [...news, ...updated]
    })
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
      acertou: questao.gabarito === 'X' || questao.gabarito === resposta,
      gabarito: questao.gabarito,
      horario: DateTime.local(),
      user_id: user?.id || 0
    })

    return respondida;
  }

  async deleteRespondida({ params }: HttpContextContract) {
    const { id } = params;

    await Respondida.query().where('id', id).delete();

    return 'ok';
  }

  async respondidas({ params, user }: HttpContextContract) {
    const { aula, questao } = params;

    const respondida = await Respondida.query()
      .where("user_id", user?.id || '')
      .where('aula_id', aula)
      .if(questao, q => q.where('questao_id', questao));



    return respondida;

  }



  async destroy({ params }: HttpContextContract) {
    const questao = await Questao.findOrFail(params.id)

    return await questao.delete()
  }

}
