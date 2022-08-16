"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Aula_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Aula"));
class AulasController {
    async index({ user, request, params }) {
        const { disciplina_id } = params;
        const { withQuestoes, page, perPage = 10, withMeta, withEstatisticas, withRegistros, withRespondidas, withDisciplina, withCadernos, order_by = 'ordem:asc' } = request.qs();
        const [c = 'ordem', o = 'asc'] = order_by.split(':');
        const query = Aula_1.default
            .query()
            .where("user_id", user?.id || '')
            .if(disciplina_id !== '', q => q.where('disciplina_id', disciplina_id))
            .if(c === 'ordem', q => q.orderBy(c, o))
            .if(c === 'name', q => q.orderBy(c, o))
            .if(withCadernos, q => q.preload('cadernos', q2 => q2.orderBy('fim', 'desc')))
            .if(withQuestoes || withEstatisticas, q => {
            q.preload('questoes', q2 => {
                q2.if(withRespondidas || withEstatisticas, q3 => q3.preload('respondidas'));
            });
        })
            .if(withRegistros || withEstatisticas, q => q.preload('registros', (query) => {
            query.select(['id', 'horario', 'tempo']);
        }))
            .if(withMeta, q => {
            q.withCount('questoes');
        })
            .if(withDisciplina, q => q.preload('disciplina'))
            .orderBy('ordem', 'asc');
        if (page) {
            return await query.paginate(page, perPage);
        }
        return await query;
    }
    async show({ params, user, request }) {
        const { disciplina_id, id } = params;
        const { withQuestoes, withRegistros, withRespondidas, withDisciplina, withMeta, withCadernos } = request.qs();
        return await Aula_1.default.query()
            .where('id', id)
            .where("user_id", user?.id || '')
            .if(disciplina_id, q => q.where('disciplina_id', disciplina_id))
            .if(withQuestoes, q => q.preload('questoes'))
            .if(withRespondidas, q => q.preload('respondidas'))
            .if(withRegistros, q => q.preload('registros', (query) => {
            query.select(['id', 'horario', 'tempo']);
        }))
            .if(withDisciplina, q => q.preload('disciplina'))
            .if(withCadernos, q => q.preload('cadernos'))
            .if(withMeta, q => {
            q.withCount('questoes');
        })
            .first();
    }
    async store({ request, user }) {
        const fields = ['name', 'ordem', 'disciplina_id'];
        const _data = { ...request.only(fields), user_id: user?.id };
        return await Aula_1.default.create(_data);
    }
    async storeLote({ request, user }) {
        const { disciplina_id, text } = request.only(['disciplina_id', 'text']);
        const data = text.split("\n").map((item, index) => {
            return {
                disciplina_id: disciplina_id,
                name: item,
                user_id: user?.id,
                ordem: index,
                concurso_id: 1
            };
        });
        return await Aula_1.default.createMany(data);
    }
    async update({ request, params }) {
        const fields = ['name', 'ordem'];
        const _data = request.only(fields);
        const aula = await Aula_1.default.findOrFail(params.id);
        await aula.merge(_data);
        await aula.save();
        return aula;
    }
}
exports.default = AulasController;
//# sourceMappingURL=AulasController.js.map