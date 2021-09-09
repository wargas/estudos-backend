import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Aula from "App/Models/Aula";
import { DateTime } from 'luxon';

export default class AulasController {

  async index({ auth, request }: HttpContextContract) {

    const { disciplina_id = '', order_by = 'ordem:asc' } = request.all()

    const [c = 'ordem', o = 'asc'] = order_by.split(':');

    const aulas = await Aula
      .query()
      .where("user_id", auth.user?.id || '')
      .if(disciplina_id !== '', q => q.where('disciplina_id', disciplina_id))
      .if(c === 'ordem', q => q.orderBy(c, o))
      .if(c === 'name', q => q.orderBy(c, o))
      .withCount('questoes')
      .orderBy('ordem', 'asc')
      .preload('questoes', q => q.preload('respondidas'))

    return aulas.map(aula => {
      const { questoes, ..._aula } = aula.serialize()
      const respondidas = questoes.reduce((acc, item) => {
        return [...acc, ...item.respondidas]
      }, [])
      const days = Array.from(
        new Set(
          respondidas.map(item => DateTime
            .fromISO(item.horario)
            .toSQLDate()
          )
        )
      ).map(day => {
        const _respondidas = respondidas.filter(item => day === DateTime.fromISO(item.horario).toSQLDate())
        const acertos = _respondidas.filter(item => item.acertou)
        const erros = _respondidas.filter(item => !item.acertou)
        return {
          data: day,
          acertos: acertos.length,
          total: _respondidas.length,
          erros: erros.length
        }
      }).map((day, _, items) => {

        const _arrayInts = items.map(item => DateTime.fromSQL(String(item.data)).toMillis())

        const lastDay = DateTime.fromMillis(Math.max(..._arrayInts)).toSQLDate()

        return { ...day, last: lastDay === day.data }
      })

      return { ..._aula, days, questoes_count: aula.$extras.questoes_count }

    })
      .sort((a, b) => {
        const lastA = a.days.find(dia => dia.last)
        const lastB = b.days.find(dia => dia.last)

        if (c === 'questoes') {
          return o === 'asc' ?
            a.questoes_count - b.questoes_count :
            b.questoes_count - a.questoes_count
        }
        if (c === 'last') {
          if (!lastB) {
            return o === 'asc' ? 1 : -1;
          }

          if (!lastA) {
            return o === 'asc' ? -1 : 1;
          }

          if (o === 'asc') {
            return DateTime.fromSQL(lastA.data + '').toMillis() -
              DateTime.fromSQL(lastB.data + '').toMillis()
          } else {
            return DateTime.fromSQL(lastB.data + '').toMillis() -
              DateTime.fromSQL(lastA.data + '').toMillis()
          }
        }

        if (c === 'nota') {
          if (!lastB) {
            return o === 'asc' ? 1 : -1;
          }

          if (!lastA) {
            return o === 'asc' ? -1 : 1;
          }
          if (o === 'asc') {
            return (lastA.acertos / lastA.total) - (lastB.acertos / lastB.total)
          } else {
            return (lastB.acertos / lastB.total) - (lastA.acertos / lastA.total)
          }

        }

        return 0
      })

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

  async store({ request, auth }: HttpContextContract) {
    const fields = ['name', 'ordem', 'disciplina_id']
    const _data = { ...request.only(fields), user_id: auth.user?.id }

    return await Aula.create(_data)
  }

  async update({ request, params }: HttpContextContract) {
    const fields = ['name', 'ordem'];

    const _data = request.only(fields);

    const aula = await Aula.findOrFail(params.id)
    await aula.merge(_data);
    await aula.save()

    return aula;

  }

}
