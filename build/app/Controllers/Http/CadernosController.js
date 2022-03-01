"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Caderno_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Caderno"));
const Questao_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Questao"));
const uuid_1 = require("uuid");
class CadernosController {
    async index({ params, request }) {
        const { aula_id } = params;
        const { page, perPage = 15 } = request.qs();
        const query = Caderno_1.default.query()
            .if(aula_id, q => q.where('aula_id', aula_id))
            .orderBy('inicio', 'desc');
        if (page) {
            return await query.paginate(page, perPage);
        }
        return await query;
    }
    async store({ params }) {
        const { aula_id } = params;
        const questoes = await Questao_1.default.query()
            .where('aula_id', aula_id);
        return await Caderno_1.default.create({
            id: uuid_1.v4(),
            aula_id: aula_id,
            total: questoes.length,
            encerrado: false
        });
    }
    async show({}) {
    }
    async edit({}) {
    }
    async update({}) {
    }
    async destroy({}) {
    }
}
exports.default = CadernosController;
//# sourceMappingURL=CadernosController.js.map