import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Respondida from 'App/Models/Respondida'

export default class RespondidasController {

  async getByAula({ params, auth }: HttpContextContract) {
    await Respondida.query()
      .where("user_id", auth.user?.id || '')
      .where('aula_id', params.id)
  }

}
