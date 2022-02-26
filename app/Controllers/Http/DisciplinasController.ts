import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Disciplina from "App/Models/Disciplina";


export default class DisciplinasController {


  async index({ user, request }: HttpContextContract) {

    const {
      countAulas = '',
      countQuestoes = '',
      whereArquivada = '0', 
      search = '',
      withAulas } = request.all()

    const disciplinas =  await Disciplina
      .query()
      .where("user_id", user?.id || '')
      .if(search !== '', q => q.where('name', 'regexp', search))
      .if(countAulas !== '', q => {
        q.withCount('aulas')

      })
      .if(countQuestoes !== '', q => {
        q.withCount('questoes')
      })
      .if(whereArquivada !== '', q => q.where('arquivada', whereArquivada))
      .if(withAulas === 'true', q => {
        q.preload('aulas')
      })
       
    return disciplinas
  }

  async show({ params, user }: HttpContextContract) {

    return await Disciplina.query()
      .where('id', params.id)
      .where("user_id", user?.id || '')
      .first()
  }

  async store({ request, user }: HttpContextContract) {
    const data = request.only(['name', 'arquivada'])

    const user_id = user?.id || 0

    return await Disciplina.create({ ...data, user_id });
  }

  async update({ request, params }: HttpContextContract) {
    const data = request.only(['name', 'arquivada'])

    const disciplina = await Disciplina.findOrFail(params.id)

    await disciplina.merge(data);

    await disciplina.save()

    return disciplina;
  }
}
