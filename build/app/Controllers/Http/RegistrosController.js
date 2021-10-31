"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Registro_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Registro"));
const luxon_1 = require("luxon");
class RegistrosController {
    async store({ request, user }) {
        const user_id = user?.id;
        return await Registro_1.default.create({
            ...request.all(),
            user_id,
            concurso_id: 1
        });
    }
    async update({ request, user }) {
        const today = luxon_1.DateTime.local().set({ hour: 0, minute: 0, second: 0 });
        const redisTodayKey = `dashboard:${user?.id}:>=${today.toSQLDate()}`;
        await Redis_1.default.del(redisTodayKey);
        const { tempo, id } = request.all();
        const registro = await Registro_1.default.find(id);
        registro.tempo = tempo;
        await registro?.save();
        return registro;
    }
}
exports.default = RegistrosController;
//# sourceMappingURL=RegistrosController.js.map