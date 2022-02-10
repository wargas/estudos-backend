"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Aula_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Aula"));
const Questao_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Questao"));
const Respondida_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Respondida"));
const QuestionHelper_1 = global[Symbol.for('ioc.use')]("App/repositories/QuestionHelper");
const luxon_1 = require("luxon");
class QuestionsController {
    async index({ request }) {
        const query = Questao_1.default.query()
            .if(request.input('id'), q => {
            q.where('id', request.input('id'));
        })
            .if(request.input('aula_id'), q => {
            q.where('aula_id', request.input('aula_id'));
        }).limit(500);
        return await query;
    }
    async show(ctx) {
        return Questao_1.default.query()
            .preload('respondidas')
            .where('id', ctx.params.id)
            .first();
    }
    async editarEmLote({ request }) {
        const markdown = request.input('markdown');
        const aula_id = request.input('aula_id');
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
        return await Promise.all([
            Questao_1.default.createMany(questoes.filter(it => !it?.id)),
            Questao_1.default.updateOrCreateMany('id', questoes.filter(it => !!it?.id))
        ]);
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
    async responder({ request, user }) {
        const today = luxon_1.DateTime.local().set({ hour: 0, minute: 0, second: 0 });
        const redisTodayKey = `dashboard:${user?.id}:>=${today.toSQLDate()}`;
        await Redis_1.default.del(redisTodayKey);
        const { questao_id, resposta } = request.all();
        const questao = await Questao_1.default.query()
            .where('id', questao_id)
            .firstOrFail();
        const respondida = await Respondida_1.default.create({
            questao_id,
            resposta,
            aula_id: questao.aula_id,
            acertou: questao.gabarito === 'X' || questao.gabarito === resposta,
            gabarito: questao.gabarito,
            horario: luxon_1.DateTime.local(),
            user_id: user?.id || 0
        });
        return respondida;
    }
    async deleteRespondida({ params }) {
        const { id } = params;
        await Respondida_1.default.query().where('id', id).delete();
        return 'ok';
    }
    async respondidas({ params, user }) {
        const { aula } = params;
        const respondida = await Respondida_1.default.query()
            .where("user_id", user?.id || '')
            .where('aula_id', aula);
        return respondida;
    }
    async destroy({ params }) {
        const questao = await Questao_1.default.findOrFail(params.id);
        return await questao.delete();
    }
}
exports.default = QuestionsController;
//# sourceMappingURL=QuestionsController.js.map