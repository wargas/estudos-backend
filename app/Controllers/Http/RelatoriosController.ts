import Redis from '@ioc:Adonis/Addons/Redis';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from "@ioc:Adonis/Lucid/Database";
import { DateTime } from 'luxon';


export default class RelatoriosController {


  async dashboard({ user }: HttpContextContract) {
    const today = DateTime.local().set({ hour: 0, minute: 0, second: 0 })
    const yesterday = today.minus({ second: 1 })
    const redisLastedKey = `dashboard:${user?.id}:<=${yesterday.toSQLDate()}`
    const redisTodayKey = `dashboard:${user?.id}:>=${today.toSQLDate()}`

    if (!(await Redis.get(redisLastedKey))) {
      const days = await this.getDashboardDays(
        user?.id,
        `horario <= '${yesterday.toSQL({ includeOffset: false })}'`
      )

      await Redis.set(redisLastedKey, JSON.stringify(days))
    }

    if (!(await Redis.get(redisTodayKey))) {
      const days = await this.getDashboardDays(
        user?.id, 
        `horario >= '${today.toSQL({ includeOffset: false })}'`)

      await Redis.set(redisTodayKey, JSON.stringify(days))
    }

    const daysLatest = await Redis.get(redisLastedKey)

    const daysToday = await Redis.get(redisTodayKey)

    return [...JSON.parse(daysToday || '[]'), ...JSON.parse(daysLatest || '[]')].sort((a, b) => {
      return DateTime.fromSQL(a.day).toMillis() - DateTime.fromSQL(b.day).toMillis()
    })
  }

  async getDashboardDays(user_id = 0, whereTempo = '') {
    const [queryQuestoes] = await Database
      .rawQuery(`SELECT DATE(horario) as data, COUNT(id) as total, SUM(acertou) acertos, user_id FROM respondidas  WHERE user_id = ${user_id} AND ${whereTempo} GROUP BY DATE(horario)`)


    const [queryTempo] = await Database
      .rawQuery(`SELECT DATE(horario) as data, sum(tempo) as tempo, user_id FROM registros  WHERE user_id = ${user_id} AND ${whereTempo} GROUP BY DATE(horario)`)


    const days = Array.from(new Set([
      ...queryQuestoes.map(day => DateTime.fromJSDate(day.data).toSQLDate()),
      ...queryTempo.map(day => DateTime.fromJSDate(day.data).toSQLDate())
    ]))
      .map(day => {

        const tempo = queryTempo.find(t => DateTime.fromJSDate(t.data).toSQLDate() === day)
        const questao = queryQuestoes.find(t => DateTime.fromJSDate(t.data).toSQLDate() === day)

        return {
          day: day,
          tempo: tempo?.tempo || 0,
          questoes: {
            total: questao?.total || 0,
            acertos: questao?.acertos || 0
          }
        }
      })


    return days
  }



}
