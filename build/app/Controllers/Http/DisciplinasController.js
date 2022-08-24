"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Disciplina_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Disciplina"));
const ViewDisciplina_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ViewDisciplina"));
class DisciplinasController {
    async index({ user, request }) {
        const { sortby, whereArquivada = '0', search = '' } = request.all();
        const disciplinas = await ViewDisciplina_1.default
            .query()
            .where("user_id", user?.id || '')
            .if(whereArquivada !== '', q => q.where('arquivada', whereArquivada))
            .if(sortby, q => {
            const [col, order = "asc"] = sortby.split(':');
            q.orderBy(col, order);
        })
            .if(search, q => {
            q.where('name', 'like', `%${search}%`);
            q.orWhere('dia', 'like', `%${search}%`);
        });
        return disciplinas;
    }
    async show({ params, user }) {
        return await ViewDisciplina_1.default.query()
            .where('id', params.id)
            .where("user_id", user?.id || '')
            .first();
    }
    async store({ request, user }) {
        const data = request.only(['name', 'arquivada']);
        const user_id = user?.id || 0;
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