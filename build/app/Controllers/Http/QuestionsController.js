"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Aula_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Aula"));
const Caderno_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Caderno"));
const Questao_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Questao"));
const Respondida_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Respondida"));
const QuestionHelper_1 = global[Symbol.for('ioc.use')]("App/repositories/QuestionHelper");
const luxon_1 = require("luxon");
class QuestionsController {
    async index({ request, params }) {
        const { aula_id } = params;
        const { page, perPage = 10, withAulas } = request.qs();
        const query = Questao_1.default.query()
            .if(aula_id, q => {
            q.whereIn('id', Database_1.default.from('aula_questao')
                .select('questao_id')
                .where('aula_id', aula_id));
        })
            .if(withAulas, q => q.preload('aulas'));
        if (page) {
            return query.paginate(page, perPage);
        }
        return await query;
    }
    async show({ request, params }) {
        const { withAulas, withRespondidas } = request.qs();
        return Questao_1.default.query()
            .where('id', params.id)
            .if(withAulas, q => q.preload('aulas'))
            .if(withRespondidas, q => q.preload('respondidas'))
            .first();
    }
    async editarEmLote({ request }) {
        const markdown = request.input('markdown');
        const aula_id = request.input('aula_id');
        const aula = await Aula_1.default.findOrFail(aula_id);
        const questoes = markdown.split('****').map(mdQuestao => {
            const partes = mdQuestao.split('***');
            const _gabarito = partes.pop();
            const [_enunciado, ..._alternativas] = partes;
            const idRegex = /^\[ID: ?(\d{1,11})\]/;
            const matchId = _enunciado.trim().match(idRegex);
            const questaoId = matchId ? matchId[1] : undefined;
            const enunciado = _enunciado.trim().replace(idRegex, "");
            const alternativas = JSON.stringify(_alternativas.length === 0 ? ['Certo', 'Errado'] : _alternativas.map(alt => alt.trim()));
            const gabarito = _gabarito.trim();
            const modalidade = alternativas.length > 2 ? 'MULTIPLA_ESCOLHA' : 'CERTO_ERRADO';
            return { enunciado, id: questaoId, alternativas, gabarito, modalidade, aula_id };
        });
        return await Database_1.default.transaction(async () => {
            const news = await aula.related('questoes').createMany(questoes.filter(it => !it?.id));
            const updated = await Questao_1.default.updateOrCreateMany('id', questoes.filter(it => !!it?.id));
            return [...news, ...updated];
        });
    }
    async editar({ params, request }) {
        const { id, questao } = params;
        const { texto = "" } = request.only(["texto"]);
        const aula = await Aula_1.default.find(id);
        QuestionHelper_1.QuestionHelper.edit(aula?.markdown, questao, texto);
    }
    async text({ params }) {
        const { id, questao } = params;
        const aula = await Aula_1.default.find(id);
        const text = QuestionHelper_1.QuestionHelper.text(aula?.markdown, questao);
        return { text };
    }
    async responder({ request, user, logger }) {
        const today = luxon_1.DateTime.local().set({ hour: 0, minute: 0, second: 0 });
        try {
            const redisTodayKey = `dashboard:${user?.id}:>=${today.toSQLDate()}`;
            await Redis_1.default.del(redisTodayKey);
        }
        catch (e) {
            logger.error('redis indisponível');
        }
        const { questao_id, resposta, caderno_id } = request.all();
        const questao = await Questao_1.default.query()
            .where('id', questao_id)
            .firstOrFail();
        const caderno = await Caderno_1.default.findOrFail(caderno_id);
        const aula = await Aula_1.default.findOrFail(caderno.aula_id);
        return Database_1.default.transaction(async () => {
            const respondida = await Respondida_1.default.create({
                questao_id,
                resposta,
                caderno_id,
                aula_id: questao.aula_id,
                acertou: questao.gabarito === 'X' || questao.gabarito === resposta,
                gabarito: questao.gabarito,
                horario: luxon_1.DateTime.local(),
                user_id: user?.id || 0
            });
            const respondidas = await Respondida_1.default.query().where('caderno_id', caderno_id);
            const questoes = await aula.related('questoes').query();
            caderno.encerrado = respondidas.length === questoes.length;
            caderno.acertos = respondidas.filter(r => r.acertou).length;
            caderno.erros = respondidas.filter(r => !r.acertou).length;
            caderno.total = questoes.length;
            if (respondidas.length === 1) {
                caderno.inicio = luxon_1.DateTime.local();
            }
            if (respondidas.length === questoes.length) {
                caderno.fim = luxon_1.DateTime.local();
            }
            await caderno.save();
            return respondida;
        });
    }
    async deleteRespondida({ params }) {
        const { id } = params;
        await Respondida_1.default.query().where('id', id).delete();
        return 'ok';
    }
    async respondidas({ params, user }) {
        const { aula, questao } = params;
        const respondida = await Respondida_1.default.query()
            .where("user_id", user?.id || '')
            .where('aula_id', aula)
            .if(questao, q => q.where('questao_id', questao));
        return respondida;
    }
    async destroy({ params }) {
        return await Database_1.default.transaction(async (trx) => {
            const questao = await Questao_1.default.findOrFail(params.id);
            await trx.from('aula_questao').where('questao_id', params.id)
                .delete();
            return await questao.delete();
        });
    }
}
exports.default = QuestionsController;
//# sourceMappingURL=QuestionsController.js.map