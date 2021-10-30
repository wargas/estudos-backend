import Redis from '@ioc:Adonis/Addons/Redis';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Registro from 'App/Models/Registro';
import { DateTime } from 'luxon';

export default class RegistrosController {

  async store({request, auth}: HttpContextContract) {

    const user_id = auth.user?.id;

    return await Registro.create({
      ...request.all(),
      user_id,
      concurso_id: 1
    })
  }
  async update({request, auth}: HttpContextContract) {
    const today = DateTime.local().set({ hour: 0, minute: 0, second: 0 })
    const redisTodayKey = `dashboard:${auth.user?.id}:>=${today.toSQLDate()}`
    await Redis.del(redisTodayKey)
    
    const {tempo, id} = request.all()
    const registro = await Registro.find(id);
    registro!.tempo = tempo;

    await registro?.save();

    return registro;
  }
}
