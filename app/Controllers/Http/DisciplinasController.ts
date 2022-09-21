import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Disciplina from "App/Models/Disciplina";
import ViewDisciplina from 'App/Models/ViewDisciplina';


export default class DisciplinasController {


  async index({ user, request }: HttpContextContract) {

    const {
      sortby,
      whereArquivada = '0', 
      search = '' } = request.all()

    const disciplinas =  await ViewDisciplina
      .query()
      .where("user_id", user?.id || '')
      .if(whereArquivada !== '', q => q.where('arquivada', whereArquivada))
      .if(sortby, q => {
        const [col, order = "asc"] = sortby.split(':')
        q.orderBy(col, order)
      })
      .if(search, q => {
        q.whereRaw(`(name like '%${search}%' OR dia like '%${search}%')`)
      })
      
       
    return disciplinas
  }

  async show({ params, user }: HttpContextContract) {

    return await ViewDisciplina.query()
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
