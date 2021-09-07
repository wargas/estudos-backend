import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comentario from 'App/Models/Comentario'

export default class ComentariosController {

  async store({ params, request, auth }: HttpContextContract) {

    const {texto} = request.all();

    const comentario = await Comentario.query()
      .where('user_id', auth.user?.id || '')
      .where('questao_id', params.questao_id)
      .orderBy('id', 'desc')
      .first();

    if (comentario) {
      comentario.texto = texto;
      await comentario.save();

      return comentario;
    }

    return Comentario.create({
      questao_id: params.questao_id,
      user_id: auth.user?.id,
      texto
    })

  }

  async show({ params, auth }: HttpContextContract) {
    const comentario = await Comentario.query()
      .where('questao_id', params.questao_id)
      .where('user_id', auth.user?.id || '')
      .orderBy('id', 'desc')
      .first();


    if(comentario) {
      return comentario;
    }

    return Comentario.create({
      questao_id: params.questao_id,
      user_id: auth.user?.id || 0,
      texto: ''
    })
  }
}
