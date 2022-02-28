import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Caderno from 'App/Models/Caderno';
import Questao from 'App/Models/Questao';
import { v4 as uuid } from 'uuid';


export default class CadernosController {
  public async index({ params, request }: HttpContextContract) {
    const { aula_id } = params;

    const { page, perPage = 15 } = request.qs()

    const query = Caderno.query()
      .if(aula_id, q => q.where('aula_id', aula_id))

    if (page) {
      return await query.paginate(page, perPage)
    }

    return await query;
  }

  public async store({ params }: HttpContextContract) {
    const { aula_id } = params;

    const questoes = await Questao.query()
      .where('aula_id', aula_id)

    return await Caderno.create({
      id: uuid(),
      aula_id: aula_id,
      total: questoes.length,
      encerrado: false
    })
  }

  public async show({ }: HttpContextContract) {
  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }
}
