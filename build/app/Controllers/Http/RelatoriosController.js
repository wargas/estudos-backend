"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Aula_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Aula"));
const luxon_1 = require("luxon");
class RelatoriosController {
    async questaoPorDia({ request, auth }) {
        const { limite = null } = request.get();
        const user_id = auth.user?.id;
        const [data] = await Database_1.default
            .rawQuery(`SELECT DATE(horario) as data, COUNT(id) as total, SUM(acertou) acertos, user_id FROM respondidas  WHERE user_id = ${user_id} GROUP BY DATE(horario)`);
        return data.sort((a, b) => {
            if (a.data < b.data) {
                return 1;
            }
            if (a.data > b.data) {
                return -1;
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
                return -1;
            }
            if (a.data > b.data) {
                return 1;
            }
            return 0;
        });
    }
    async questoesMedia({ params }) {
        let aulas = await Aula_1.default.query()
            .where('disciplina_id', params.id)
            .preload('respondidas');
        return aulas.map(_aula => {
            const { id, name, ordem, paginas, markdown, user_id, concurso_id, disciplina_id, questoes } = _aula;
            const historico = _aula.respondidas.reduce((acc, item) => {
                const current = acc.find((accItem) => accItem.data.hasSame(item.horario, 'day'));
                if (!current) {
                    acc.push({ data: item.horario, acertos: 0, erros: 0 });
                }
                return acc.map((accItem) => {
                    if (accItem.data.hasSame(item.horario, 'day')) {
                        if (item.acertou) {
                            accItem.acertos = accItem.acertos + 1;
                        }
                        else {
                            accItem.erros = accItem.erros + 1;
                        }
                    }
                    return accItem;
                });
            }, []);
            return { id, name, ordem, paginas, markdown, user_id, concurso_id, disciplina_id, questoes, historico };
        });
    }
    async tempoPorDia({ request, auth }) {
        const { limite = 10 } = request.get();
        const user_id = auth.user?.id;
        const [data] = await Database_1.default
            .rawQuery(`SELECT DATE(horario) as data, SUM(tempo) as tempo FROM registros WHERE user_id = ${user_id} GROUP BY DATE(horario)`);
        return Array(parseInt(limite)).fill('').map((_, index) => {
            const current = luxon_1.DateTime.local()
                .minus({ day: parseInt(limite) })
                .plus({ day: index + 1 });
            const tempo = data.find(item => luxon_1.DateTime.fromJSDate(item.data).toFormat('ddMMyyyy') === current.toFormat('ddMMyyyy'));
            return {
                data: current.toFormat('yyyy-MM-dd'),
                tempo: tempo?.tempo || 0
            };
        });
    }
    async rankingTempoDia({ request, auth }) {
        const { limite = 10 } = request.get();
        const user_id = auth.user?.id;
        const [data] = await Database_1.default
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
            item.hoje = luxon_1.DateTime.fromJSDate(item.data).toFormat('ddMMyyyy') === luxon_1.DateTime.local().toFormat('ddMMyyyy');
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
        });
    }
    async rankingQuestoesDia({ request, auth }) {
        const { limite = 10 } = request.all();
        const user_id = auth.user?.id;
        const [data] = await Database_1.default
            .rawQuery(`SELECT DATE(horario) as data, COUNT(id) as total, SUM(acertou) acertos, user_id FROM respondidas WHERE user_id = ${user_id} GROUP BY DATE(horario)`);
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
            item.hoje = luxon_1.DateTime.local().toFormat('yyyyMMdd') === luxon_1.DateTime.fromJSDate(item.data).toFormat('yyyyMMdd');
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
        const aulas = await Aula_1.default.query()
            .where('disciplina_id', id);
        const ids = aulas.map(aula => aula.id);
        const respondidas = await Database_1.default.from('estudos.view_respondidas_dia')
            .whereIn('aula_id', ids);
        return aulas.map(aula => {
            return { ...aula.toJSON(), relatorio: respondidas
                    .filter(res => res.aula_id === aula.id && res.total >= aula.questoes) };
        });
    }
}
exports.default = RelatoriosController;
//# sourceMappingURL=RelatoriosController.js.map