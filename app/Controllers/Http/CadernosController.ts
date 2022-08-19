import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import Caderno from 'App/Models/Caderno';
import CadernoQuestao from 'App/Models/CadernoQuestao';
import Questao from 'App/Models/Questao';
import ViewCaderno from 'App/Models/ViewCaderno';


export default class CadernosController {

  public async index({ params, request }: HttpContextContract) {
    const { aula_id } = params;

    const { page, perPage = 15 } = request.qs()

    const query = ViewCaderno.query()
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

    return Database.transaction(async trx => {
      const caderno = await Caderno.create({
        aula_id: aula_id,
        total: questoes.length,
        encerrado: false,
      }, {
        client: trx
      })

      await CadernoQuestao.createMany(
        questoes.map(questao => {
          return {
            questao_id: questao.id,
            caderno_id: caderno.id
          }
        }),
        {
          client: trx
        }
      )

      return caderno
    })
  }

  public async show({ params }: HttpContextContract) {

    const caderno = await ViewCaderno.findOrFail(params.id)

    return caderno;

  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }
}
