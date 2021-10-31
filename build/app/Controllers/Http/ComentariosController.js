"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Comentario_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Comentario"));
class ComentariosController {
    async store({ params, request, user }) {
        const { texto } = request.all();
        const comentario = await Comentario_1.default.query()
            .where('user_id', user?.id || '')
            .where('questao_id', params.questao_id)
            .orderBy('id', 'desc')
            .first();
        if (comentario) {
            comentario.texto = texto;
            await comentario.save();
            return comentario;
        }
        return Comentario_1.default.create({
            questao_id: params.questao_id,
            user_id: user?.id,
            texto
        });
    }
    async show({ params, user }) {
        const comentario = await Comentario_1.default.query()
            .where('questao_id', params.questao_id)
            .where('user_id', user?.id || '')
            .orderBy('id', 'desc')
            .first();
        if (comentario) {
            return comentario;
        }
        return Comentario_1.default.create({
            questao_id: params.questao_id,
            user_id: user?.id || 0,
            texto: ''
        });
    }
}
exports.default = ComentariosController;
//# sourceMappingURL=ComentariosController.js.map