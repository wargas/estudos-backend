import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Aula from "App/Models/Aula";
import ViewAula from 'App/Models/ViewAula';


export default class AulasController {

  async index({ user, request, params }: HttpContextContract) {

    const { disciplina_id } = params

    const { page,
      perPage = 10,
      ordem = 'asc', sort = 'ordem' } = request.qs()

      console.time('teste')

    const query = ViewAula
      .query()
      .where("user_id", user?.id || '')
      .if(sort, q => {
        q.orderBy(sort, ordem)
      })
      .if(disciplina_id !== '', q => q.where('disciplina_id', disciplina_id))


    if (page) {
      return await query.paginate(page, perPage)
    }


    const q = await query;
    console.timeEnd('teste')
    return q
  }

  async show({ params, user, request }: HttpContextContract) {

    const { disciplina_id, id } = params
    const { withQuestoes, withRegistros, withRespondidas, withDisciplina, withMeta, withCadernos } = request.qs()

    return await Aula.query()
      .where('id', id)
      .where("user_id", user?.id || '')
      .if(disciplina_id, q => q.where('disciplina_id', disciplina_id))
      .if(withQuestoes, q => q.preload('questoes'))
      .if(withRespondidas, q => q.preload('respondidas'))
      .if(withRegistros, q => q.preload('registros', (query) => {
        query.select(['id', 'horario', 'tempo'])
      }))
      .if(withDisciplina, q => q.preload('disciplina'))
      .if(withCadernos, q => q.preload('cadernos'))
      .if(withMeta, q => {
        q.withCount('questoes')
      })
      .first()
  }

  async store({ request, user }: HttpContextContract) {
    const fields = ['name', 'ordem', 'disciplina_id']
    const _data = { ...request.only(fields), user_id: user?.id }

    return await Aula.create(_data)
  }

  async storeLote({ request, user }: HttpContextContract) {
    const { disciplina_id, text } = request.only(['disciplina_id', 'text'])

    const data = text.split("\n").map((item, index) => {
      return {
        disciplina_id: disciplina_id,
        name: item,
        user_id: user?.id,
        ordem: index,
        concurso_id: 1
      }
    })

    return await Aula.createMany(data)

  }

  async update({ request, params }: HttpContextContract) {
    const fields = ['name', 'ordem'];

    const _data = request.only(fields);

    const aula = await Aula.findOrFail(params.id)
    await aula.merge(_data);
    await aula.save()

    return aula;

  }

}
