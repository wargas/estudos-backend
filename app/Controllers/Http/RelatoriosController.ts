import Redis from '@ioc:Adonis/Addons/Redis';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from "@ioc:Adonis/Lucid/Database";
import Aula from "App/Models/Aula";
import { DateTime } from 'luxon';


export default class RelatoriosController {


  async dashboard({ auth }: HttpContextContract) {
    const today = DateTime.local().set({ hour: 0, minute: 0, second: 0 })
    const yesterday = today.minus({ second: 1 })
    const redisLastedKey = `dashboard:${auth.user?.id}:<=${yesterday.toSQLDate()}`
    const redisTodayKey = `dashboard:${auth.user?.id}:>=${today.toSQLDate()}`

    if (!(await Redis.get(redisLastedKey))) {
      const days = await this.getDashboardDays(
        auth.user?.id,
        `horario <= '${yesterday.toSQL({ includeOffset: false })}'`
      )

      await Redis.set(redisLastedKey, JSON.stringify(days))
    }

    if (!(await Redis.get(redisTodayKey))) {
      const days = await this.getDashboardDays(
        auth.user?.id, 
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


  async questaoPorDia({ request, auth }: HttpContextContract) {
    const { limite = null } = request.all();

    const user_id = auth.user?.id;

    const [data] = await Database
      .rawQuery(`SELECT DATE(horario) as data, COUNT(id) as total, SUM(acertou) acertos, user_id FROM respondidas  WHERE user_id = ${user_id} GROUP BY DATE(horario)`)

    return data.sort((a, b) => {
      if (a.data < b.data) {
        return 1
      }
      if (a.data > b.data) {
        return -1
      }

      return 0;
    }).filter((_, index) => {
      if (!limite) {
        return true;
      }
      if (index < limite) {
        return true;
      }

      return false;
    }).sort((a, b) => {
      if (a.data < b.data) {
        return -1
      }
      if (a.data > b.data) {
        return 1
      }

      return 0;
    });
  }



  async questoesMedia({ params }) {
    let aulas = await Aula.query()
      .where('disciplina_id', params.id)
      .preload('respondidas')

    return aulas.map(_aula => {
      const { id, name, ordem, paginas, markdown, user_id, concurso_id, disciplina_id, questoes } = _aula;

      const historico = _aula.respondidas.reduce<{ data: DateTime, erros: number, acertos: number }[]>((acc, item) => {
        const current = acc.find((accItem) => accItem.data.hasSame(item.horario, 'day'))

        if (!current) {
          acc.push({ data: item.horario, acertos: 0, erros: 0 })
        }

        return acc.map((accItem) => {

          if (accItem.data.hasSame(item.horario, 'day')) {
            if (item.acertou) {
              accItem.acertos = accItem.acertos + 1
            } else {
              accItem.erros = accItem.erros + 1
            }
          }

          return accItem
        });
      }, [])

      return { id, name, ordem, paginas, markdown, user_id, concurso_id, disciplina_id, questoes, historico }
    });
  }

  async tempoPorDia({ request, auth }: HttpContextContract) {
    const { limite = 10 } = request.get();
    const user_id = auth.user?.id;

    const [data] = await Database
      .rawQuery(`SELECT DATE(horario) as data, SUM(tempo) as tempo FROM registros WHERE user_id = ${user_id} GROUP BY DATE(horario)`);

    return Array(parseInt(limite)).fill('').map((_, index) => {

      const current = DateTime.local()
        .minus({ day: parseInt(limite) })
        .plus({ day: index + 1 });

      const tempo = data.find(item =>
        DateTime.fromJSDate(item.data).toFormat('ddMMyyyy') === current.toFormat('ddMMyyyy'))

      return {
        data: current.toFormat('yyyy-MM-dd'),
        tempo: tempo?.tempo || 0
      };
    })

  }

  async rankingTempoDia({ request, auth }) {
    const { limite = 10 } = request.get();

    const user_id = auth.user?.id;

    const [data] = await Database
      .rawQuery(`SELECT DATE(horario) as data, SUM(tempo) as tempo, user_id FROM registros WHERE user_id = ${user_id} GROUP BY DATE(horario) `);

    return data.sort((a, b) => {

      if (a.tempo > b.tempo) {
        return -1;
      }

      if (a.tempo < b.tempo) {
        return 1;
      }

      return 0;
    })
      .map((item, index) => {
        item.position = index + 1;
        item.hoje = DateTime.fromJSDate(item.data).toFormat('ddMMyyyy') === DateTime.local().toFormat('ddMMyyyy')
        return item;
      })
      .filter((item, index) => {
        if (index < limite) {
          return true;
        }

        if (item.hoje) {
          return true;
        }

        return false;
      })

  }


  async rankingQuestoesDia({ request, auth }: HttpContextContract) {

    const { limite = 10 } = request.all();
    const user_id = auth.user?.id;

    const [data] = await Database
      .rawQuery(`SELECT DATE(horario) as data, COUNT(id) as total, SUM(acertou) acertos, user_id FROM respondidas WHERE user_id = ${user_id} GROUP BY DATE(horario)`)

    return data.sort((a, b) => {
      if (a.total > b.total) {
        return -1;
      }
      if (a.total < b.total) {
        return 1;
      }

      return 0;
    }).map((item, index) => {

      item.position = index + 1;
      item.hoje = DateTime.local().toFormat('yyyyMMdd') === DateTime.fromJSDate(item.data).toFormat('yyyyMMdd')

      return item;
    }).filter((item, index) => {
      if (item.hoje) {
        return true;
      }

      if (index < limite) {
        return true;
      }

      return false;
    });
  }

  async respondidasPorDisciplina({ params: { id = 0 } }) {

    const aulas = await Aula.query()
      .where('disciplina_id', id)

    const ids = aulas.map(aula => aula.id);

    const respondidas = await Database.from('estudos.view_respondidas_dia')
      .whereIn('aula_id', ids);

    return aulas.map(aula => {
      return {
        ...aula.toJSON(), relatorio: respondidas
          .filter(res => res.aula_id === aula.id && res.total >= aula.questoes)
      };
    })
  }

}
