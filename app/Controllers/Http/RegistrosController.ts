import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Registro from 'App/Models/Registro';

export default class RegistrosController {

  async store({request, auth}: HttpContextContract) {

    const user_id = auth.user?.id;

    return await Registro.create({
      ...request.all(),
      user_id,
      concurso_id: 1
    })
  }
  async update({request}: HttpContextContract) {
    const {tempo, id} = request.all()
    const registro = await Registro.find(id);
    registro!.tempo = tempo;

    await registro?.save();

    return registro;
  }
}
