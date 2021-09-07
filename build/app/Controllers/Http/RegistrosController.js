"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Registro_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Registro"));
class RegistrosController {
    async store({ request, auth }) {
        const user_id = auth.user?.id;
        return await Registro_1.default.create({
            ...request.all(),
            user_id,
            concurso_id: 1
        });
    }
    async update({ request }) {
        const { tempo, id } = request.all();
        const registro = await Registro_1.default.find(id);
        registro.tempo = tempo;
        await registro?.save();
        return registro;
    }
}
exports.default = RegistrosController;
//# sourceMappingURL=RegistrosController.js.map