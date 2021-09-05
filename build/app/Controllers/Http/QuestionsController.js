"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const luxon_1 = require("luxon");
const Aula_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Aula"));
const Respondida_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Respondida"));
const Questao_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Questao"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const ExtractQuestions_1 = global[Symbol.for('ioc.use')]("App/repositories/ExtractQuestions");
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
        ExtractQuestions_1.ExtractQuestions.edit(aula?.markdown, questao, texto);
    }
    async text({ params }) {
        const { id, questao } = params;
        const aula = await Aula_1.default.find(id);
        const text = ExtractQuestions_1.ExtractQuestions.text(aula?.markdown, questao);
        return { text };
    }
    async responder({ request, auth }) {
        const { questao_id, resposta } = request.all();
        const questao = await Questao_1.default.query()
            .where('id', questao_id)
            .firstOrFail();
        const respondida = await Respondida_1.default.create({
            questao_id,
            resposta,
            aula_id: questao.aula_id,
            acertou: questao.gabarito === resposta,
            gabarito: questao.gabarito,
            horario: luxon_1.DateTime.local(),
            user_id: auth.user?.id || 0
        });
        return respondida;
    }
    async deleteRespondida({ params }) {
        const { id } = params;
        await Respondida_1.default.query().where('id', id).delete();
        return 'ok';
    }
    async respondidas({ params, auth }) {
        const { aula } = params;
        const respondida = await Respondida_1.default.query()
            .where("user_id", auth.user?.id || '')
            .where('aula_id', aula);
        return respondida;
    }
    async upload({ request }) {
        const image = request.file('image');
        await image?.move(`${Env_1.default.get('UPLOAD_ROOT')}`, {
            name: `image-${luxon_1.DateTime.local().toMillis()}.${image.extname}`
        });
        return { ...image?.toJSON(), filePath: undefined, clientName: undefined };
    }
    async erros({ params }) {
        const { dia } = params;
        let aula = await Aula_1.default.query().where('markdown', `${dia}.md`).first();
        if (!aula) {
            aula = await Aula_1.default.create({
                name: `Erros do dia ${dia}`,
                disciplina_id: 54,
                markdown: `${dia}.md`,
                user_id: 1,
                ordem: 0,
                concurso_id: 1
            });
        }
        const [questoes] = await Database_1.default.rawQuery(`
      SELECT questao, aula_id, aulas.markdown
        FROM respondidas
        INNER JOIN aulas ON respondidas.aula_id = aulas.id
        where DATE(horario) = DATE('${dia}') AND acertou = 0
    `);
        const texto = questoes.map(questao => {
            return ExtractQuestions_1.ExtractQuestions.text(questao.markdown, parseInt(questao.questao));
        }).join("****");
        await ExtractQuestions_1.ExtractQuestions.makeFile(`${dia}.md`, texto);
        return aula;
    }
}
exports.default = QuestionsController;
//# sourceMappingURL=QuestionsController.js.map