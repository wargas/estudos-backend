import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Comentario from 'App/Models/Comentario';

export default class ComentariosController {

  async store({ params, request, user }: HttpContextContract) {

    const {texto} = request.all();

    const comentario = await Comentario.query()
      .where('user_id', user?.id || '')
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
      user_id: user?.id,
      texto
    })

  }

  async show({ params, user }: HttpContextContract) {
    const comentario = await Comentario.query()
      .where('questao_id', params.questao_id)
      .where('user_id', user?.id || '')
      .orderBy('id', 'desc')
      .first();


    if(comentario) {
      return comentario;
    }

    return Comentario.create({
      questao_id: params.questao_id,
      user_id: user?.id || 0,
      texto: ''
    })
  }
}
