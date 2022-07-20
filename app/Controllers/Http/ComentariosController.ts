import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Comentario from 'App/Models/Comentario';

export default class ComentariosController {

  async index({params}: HttpContextContract) {

    const { questao_id } = params;

    const query = Comentario.query()
      .if(questao_id, q => q.where('questao_id', questao_id))

    return await query
  }

  async store({ params, request, user }: HttpContextContract) {

    const {texto} = request.all();

    return Comentario.create({
      questao_id: params.questao_id,
      user_id: user?.id,
      texto
    })

  }

  async destroy({params}: HttpContextContract) {
    const item = await Comentario.findOrFail(params.id);

    return await item.delete()
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
