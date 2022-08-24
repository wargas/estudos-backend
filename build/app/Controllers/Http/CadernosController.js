"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Caderno_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Caderno"));
const CadernoQuestao_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/CadernoQuestao"));
const Questao_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Questao"));
const ViewCaderno_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ViewCaderno"));
class CadernosController {
    async index({ params, request }) {
        const { aula_id } = params;
        const { page, perPage = 15 } = request.qs();
        const query = ViewCaderno_1.default.query()
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
            .whereIn('id', Database_1.default.from('aula_questao')
            .select('questao_id')
            .where('aula_id', aula_id));
        return Database_1.default.transaction(async (trx) => {
            const caderno = await Caderno_1.default.create({
                aula_id: aula_id,
                total: questoes.length,
                encerrado: false,
            }, {
                client: trx
            });
            await CadernoQuestao_1.default.createMany(questoes.map(questao => {
                return {
                    questao_id: questao.id,
                    caderno_id: caderno.id
                };
            }), {
                client: trx
            });
            return caderno;
        });
    }
    async show({ params }) {
        const caderno = await ViewCaderno_1.default.findOrFail(params.id);
        return caderno;
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