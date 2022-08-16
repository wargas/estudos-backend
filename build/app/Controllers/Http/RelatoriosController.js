"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const luxon_1 = require("luxon");
class RelatoriosController {
    async dashboard({ user }) {
        const today = luxon_1.DateTime.local().set({ hour: 0, minute: 0, second: 0 });
        const yesterday = today.minus({ second: 1 });
        const redisLastedKey = `dashboard:${user?.id}:<=${yesterday.toSQLDate()}`;
        const redisTodayKey = `dashboard:${user?.id}:>=${today.toSQLDate()}`;
        if (!(await Redis_1.default.get(redisLastedKey))) {
            const days = await this.getDashboardDays(user?.id, `horario <= '${yesterday.toSQL({ includeOffset: false })}'`);
            await Redis_1.default.set(redisLastedKey, JSON.stringify(days));
        }
        if (!(await Redis_1.default.get(redisTodayKey))) {
            const days = await this.getDashboardDays(user?.id, `horario >= '${today.toSQL({ includeOffset: false })}'`);
            await Redis_1.default.set(redisTodayKey, JSON.stringify(days));
        }
        const daysLatest = await Redis_1.default.get(redisLastedKey);
        const daysToday = await Redis_1.default.get(redisTodayKey);
        return [...JSON.parse(daysToday || '[]'), ...JSON.parse(daysLatest || '[]')].sort((a, b) => {
            return luxon_1.DateTime.fromSQL(a.day).toMillis() - luxon_1.DateTime.fromSQL(b.day).toMillis();
        });
    }
    async getDashboardDays(user_id = 0, whereTempo = '') {
        const [queryQuestoes] = await Database_1.default
            .rawQuery(`SELECT 
        DATE(horario) as data, 
        COUNT(id) as total, 
        SUM(acertou) acertos, 
        RANK() OVER (order by COUNT(*) desc) as position,  
        user_id 
        FROM respondidas
      WHERE user_id = ${user_id} AND ${whereTempo} GROUP BY DATE(horario)`);
        const [queryTempo] = await Database_1.default
            .rawQuery(`SELECT 
        DATE(horario) as data, 
        sum(tempo) as tempo, 
        RANK() OVER (order by sum(tempo) desc) as position,  
        user_id 
      FROM registros  WHERE user_id = ${user_id} AND ${whereTempo} GROUP BY DATE(horario)`);
        const days = Array.from(new Set([
            ...queryQuestoes.map(day => luxon_1.DateTime.fromJSDate(day.data).toSQLDate()),
            ...queryTempo.map(day => luxon_1.DateTime.fromJSDate(day.data).toSQLDate())
        ]))
            .map(day => {
            const tempo = queryTempo.find(t => luxon_1.DateTime.fromJSDate(t.data).toSQLDate() === day);
            const questao = queryQuestoes.find(t => luxon_1.DateTime.fromJSDate(t.data).toSQLDate() === day);
            return {
                day: day,
                tempo: tempo?.tempo || 0,
                positionTempo: tempo?.position,
                positionQuestoes: questao?.position || 0,
                questoes: {
                    total: questao?.total || 0,
                    acertos: questao?.acertos || 0
                }
            };
        });
        return days;
    }
}
exports.default = RelatoriosController;
//# sourceMappingURL=RelatoriosController.js.map