import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Aula from "App/Models/Aula";

export default class AulasController {

  async index({ auth }: HttpContextContract) {
    return await Aula
      .query()
      .where("user_id", auth.user?.id || '')
  }

  async show({ params, auth }: HttpContextContract) {
    return await Aula.query()
      .where('id', params.id)
      .where("user_id", auth.user?.id || '')
      .preload('disciplina')
      .preload('respondidas')
      .preload('questoes')
      .preload('registros', (query) => {
        query.select(['id', 'horario', 'tempo'])
      })
      .first()
  }

  async store({request, auth}: HttpContextContract) {
    const fields = ['name', 'ordem', 'disciplina_id']
    const _data = {...request.only(fields), user_id: auth.user?.id}

    return await Aula.create(_data)
  }

  async update({request, params}: HttpContextContract) {
    const fields = ['name', 'ordem'];

    const _data = request.only(fields);

    const aula = await Aula.findOrFail(params.id)
    await aula.merge(_data);
    await aula.save()

    return aula;

  }

}
