import Redis from '@ioc:Adonis/Addons/Redis';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Registro from 'App/Models/Registro';
import { DateTime } from 'luxon';

export default class RegistrosController {

  async store({ request, user }: HttpContextContract) {

    const user_id = user?.id;

    return await Registro.create({
      ...request.all(),
      user_id,
      concurso_id: 1
    })
  }
  async update({ request, user, logger }: HttpContextContract) {
    try {
      const today = DateTime.local().set({ hour: 0, minute: 0, second: 0 })
      const redisTodayKey = `dashboard:${user?.id}:>=${today.toSQLDate()}`
      await Redis.del(redisTodayKey)

    } catch (error) {
      logger.error("redis indisponível");
    }

    const { tempo, id } = request.all()
    const registro = await Registro.find(id);
    registro!.tempo = tempo;

    await registro?.save();

    return registro;
  }
}
