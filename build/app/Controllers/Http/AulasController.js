"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Aula_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Aula"));
class AulasController {
    async index({ auth }) {
        return await Aula_1.default
            .query()
            .where("user_id", auth.user?.id || '');
    }
    async show({ params, auth }) {
        return await Aula_1.default.query()
            .where('id', params.id)
            .where("user_id", auth.user?.id || '')
            .preload('disciplina')
            .preload('respondidas')
            .preload('questoes')
            .preload('registros', (query) => {
            query.select(['id', 'horario', 'tempo']);
        })
            .first();
    }
    async store({ request, auth }) {
        const fields = ['name', 'ordem', 'disciplina_id'];
        const _data = { ...request.only(fields), user_id: auth.user?.id };
        return await Aula_1.default.create(_data);
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