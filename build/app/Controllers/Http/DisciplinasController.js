"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Disciplina_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Disciplina"));
class DisciplinasController {
    async index({ auth, request }) {
        const { countAulas = '', countQuestoes = '', whereArquivada = '0', preloadAulas = 'false' } = request.all();
        const disciplinas = await Disciplina_1.default
            .query()
            .where("user_id", auth.user?.id || '')
            .if(countAulas !== '', q => {
            q.withCount('aulas');
        })
            .if(countQuestoes !== '', q => {
            q.withCount('questoes');
        })
            .if(whereArquivada !== '', q => q.where('arquivada', whereArquivada))
            .if(preloadAulas === 'true', q => {
            q.preload('aulas');
        });
        return disciplinas;
    }
    async show({ params, auth, request }) {
        const { orderByAulas = null } = request.all();
        return await Disciplina_1.default.query()
            .where('id', params.id)
            .where("user_id", auth.user?.id || '')
            .preload('aulas', query => {
            query.if(orderByAulas, query3 => {
                const [coluna = 'id', ordem = 'asc'] = orderByAulas.split(':');
                query3.orderBy(coluna, ordem);
            }).preload('questoes', query2 => {
                query2.preload('respondidas');
            });
        })
            .first();
    }
    async store({ request, auth }) {
        const data = request.only(['name', 'arquivada']);
        const user_id = auth.user?.id || 0;
        return await Disciplina_1.default.create({ ...data, user_id });
    }
    async update({ request, params }) {
        const data = request.only(['name', 'arquivada']);
        const disciplina = await Disciplina_1.default.findOrFail(params.id);
        await disciplina.merge(data);
        await disciplina.save();
        return disciplina;
    }
}
exports.default = DisciplinasController;
//# sourceMappingURL=DisciplinasController.js.map