"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
function AulaEstatiscas(aula) {
    const { questoes = [] } = aula.serialize();
    const respondidas = questoes?.reduce((acc, item) => {
        return [...acc, ...item.respondidas];
    }, []) || [];
    const registros = aula.registros || [];
    const days = Array.from(new Set([...respondidas.map(item => luxon_1.DateTime
            .fromISO(item.horario)
            .toSQLDate()), ...registros.map(reg => reg.horario.toSQLDate())])).map(day => {
        const _respondidas = respondidas.filter(item => day === luxon_1.DateTime.fromISO(item.horario).toSQLDate());
        const acertos = _respondidas.filter(item => item.acertou);
        const erros = _respondidas.filter(item => !item.acertou);
        const tempo = registros.filter(resp => resp.horario.toSQLDate() === day)
            .reduce((acc, res) => {
            return acc + res.tempo;
        }, 0);
        return {
            data: day,
            acertos: acertos.length,
            total: _respondidas.length,
            erros: erros.length,
            tempo
        };
    }).map((day, _, items) => {
        const _arrayInts = items.map(item => luxon_1.DateTime.fromSQL(String(item.data)).toMillis());
        const lastDay = luxon_1.DateTime.fromMillis(Math.max(..._arrayInts)).toSQLDate();
        return { ...day, last: lastDay === day.data };
    });
    return days;
}
exports.default = AulaEstatiscas;
//# sourceMappingURL=AulaEstatisticas.js.map