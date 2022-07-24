import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import Caderno from 'App/Models/Caderno';
import Questao from 'App/Models/Questao';


export default class CadernosController {
  public async index({ params, request }: HttpContextContract) {
    const { aula_id } = params;

    const { page, perPage = 15 } = request.qs()

    const query = Caderno.query()
      .if(aula_id, q => q.where('aula_id', aula_id))
      .orderBy('inicio', 'desc')

    if (page) {
      return await query.paginate(page, perPage)
    }

    return await query;
  }

  public async store({ params }: HttpContextContract) {
    const { aula_id } = params;

    const questoes = await Questao.query()
      .whereIn('id',
        Database.from('aula_questao')
          .select('questao_id')
          .where('aula_id', aula_id)
      )

    return await Caderno.create({
      aula_id: aula_id,
      total: questoes.length,
      encerrado: false
    })
  }

  public async show({ params }: HttpContextContract) {

    const caderno = await Caderno.findOrFail(params.id)

    return caderno;

  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }
}
