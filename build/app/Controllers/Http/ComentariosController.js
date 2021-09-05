"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Comentario_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Comentario"));
class ComentariosController {
    async store({ params, request }) {
        const { texto } = request.all();
        const comentario = await Comentario_1.default.query()
            .where('aula_id', params.aula_id)
            .where('questao', params.questao)
            .first();
        if (comentario) {
            comentario.texto = texto;
            await comentario.save();
            return comentario;
        }
        return Comentario_1.default.create({
            aula_id: params.aula_id,
            questao: params.questao,
            texto
        });
    }
    async show({ params }) {
        const comentario = await Comentario_1.default.query()
            .where('aula_id', params.aula_id)
            .where('questao', params.questao)
            .first();
        if (comentario) {
            return comentario;
        }
        return Comentario_1.default.create({
            aula_id: params.aula_id,
            questao: params.questao,
            texto: ''
        });
    }
}
exports.default = ComentariosController;
//# sourceMappingURL=ComentariosController.js.map