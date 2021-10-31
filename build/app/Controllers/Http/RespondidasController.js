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
}
exports.default = RespondidasController;
//# sourceMappingURL=RespondidasController.js.map