"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Respondida_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Respondida"));
class RespondidasController {
    async getByAula({ params, user }) {
        await Respondida_1.default.query()
            .where("user_id", user?.id || '')
            .where('aula_id', params.id);
    }
    async index({ params, user }) {
        const { questao_id } = params;
        const respondidas = await Respondida_1.default.query()
            .if(questao_id, q => q.where('questao_id', questao_id))
            .where("user_id", user?.id || '');
        return respondidas;
    }
    async destroy({ params }) {
        const respondida = await Respondida_1.default.findOrFail(params.id);
        return await respondida.delete();
    }
}
exports.default = RespondidasController;
//# sourceMappingURL=RespondidasController.js.map