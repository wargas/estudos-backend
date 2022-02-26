import Aula from "App/Models/Aula"
import { DateTime } from "luxon"

export default function AulaEstatiscas(aula: Aula) {
    
    const { questoes = []} = aula.serialize()
      const respondidas = questoes?.reduce((acc, item) => {
        return [...acc, ...item.respondidas]
      }, []) || []

      const registros = aula.registros || []

      const days = Array.from(
        new Set(
          [...respondidas.map(item => DateTime
            .fromISO(item.horario)
            .toSQLDate()
          ), ...registros.map(reg => reg.horario.toSQLDate())]
        )
      ).map(day => {
        const _respondidas = respondidas.filter(item => day === DateTime.fromISO(item.horario).toSQLDate())
        const acertos = _respondidas.filter(item => item.acertou)
        const erros = _respondidas.filter(item => !item.acertou)

        const tempo = registros.filter(resp => resp.horario.toSQLDate() === day)
          .reduce((acc, res) => {
            return acc + res.tempo
          }, 0)

        return {
          data: day,
          acertos: acertos.length,
          total: _respondidas.length,
          erros: erros.length,
          tempo
        }
      }).map((day, _, items) => {

        const _arrayInts = items.map(item => DateTime.fromSQL(String(item.data)).toMillis())

        const lastDay = DateTime.fromMillis(Math.max(..._arrayInts)).toSQLDate()

        return { ...day, last: lastDay === day.data }
      })

      return days;
}