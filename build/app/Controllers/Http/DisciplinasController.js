"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Disciplina_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Disciplina"));
class DisciplinasController {
    async index({ auth, request }) {
        const { countAulas = '', countQuestoes = '', whereArquivada = '0', search = '', preloadAulas = 'false' } = request.all();
        const disciplinas = await Disciplina_1.default
            .query()
            .where("user_id", auth.user?.id || '')
            .if(search !== '', q => q.where('name', 'regexp', search))
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
    async show({ params, auth }) {
        return await Disciplina_1.default.query()
            .where('id', params.id)
            .where("user_id", auth.user?.id || '')
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