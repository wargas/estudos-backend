import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comentario from 'App/Models/Comentario'

export default class ComentariosController {

  async store({ params, request }: HttpContextContract) {

    const {texto} = request.all();

    const comentario = await Comentario.query()
      .where('aula_id', params.aula_id)
      .where('questao', params.questao)
      .first();

    if (comentario) {
      comentario.texto = texto;
      await comentario.save();

      return comentario;
    }

    return Comentario.create({
      aula_id: params.aula_id,
      questao: params.questao,
      texto
    })

  }
  async show({ params }: HttpContextContract) {
    const comentario = await Comentario.query()
      .where('aula_id', params.aula_id)
      .where('questao', params.questao)
      .first();

    if(comentario) {
      return comentario;
    }

    return Comentario.create({
      aula_id: params.aula_id,
      questao: params.questao,
      texto: ''
    })

  }

}
