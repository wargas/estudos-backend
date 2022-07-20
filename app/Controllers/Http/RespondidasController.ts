import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Respondida from 'App/Models/Respondida'

export default class RespondidasController {

  async getByAula({ params, user }: HttpContextContract) {
    await Respondida.query()
      .where("user_id", user?.id || '')
      .where('aula_id', params.id)
  }

  async index({params, user}: HttpContextContract) {
    const { questao_id } = params
    const respondidas = await Respondida.query()
      .if(questao_id, q => q.where('questao_id', questao_id))
      .where("user_id", user?.id || '')


    return respondidas;

  }

  async destroy({params}: HttpContextContract) {
    const respondida = await Respondida.findOrFail(params.id)

    return await respondida.delete()
  }

}
