"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
Route_1.default.post('api/auth/login', 'AuthController.login');
Route_1.default.group(() => {
    Route_1.default.resource('aulas', 'AulasController');
    Route_1.default.resource('disciplinas', 'DisciplinasController');
    Route_1.default.resource('questoes', 'QuestionsController');
    Route_1.default.post('questoes/editar-lote', 'QuestionsController.editarEmLote');
    Route_1.default.post('questoes/upload', 'QuestionsController.upload');
    Route_1.default.post('questoes/responder', 'QuestionsController.responder');
    Route_1.default.post('questoes/:id/:questao', 'QuestionsController.editar');
    Route_1.default.get('questoes/:id/:questao', 'QuestionsController.text');
    Route_1.default.get('respondidas/:aula/:questao', 'QuestionsController.respondidas');
    Route_1.default.delete('respondidas/:id', 'QuestionsController.deleteRespondida');
    Route_1.default.get('respondidas/:aula', 'QuestionsController.respondidas');
    Route_1.default.resource('registros', 'RegistrosController');
    Route_1.default.get('comentarios/:aula_id/:questao', 'ComentariosController.show');
    Route_1.default.post('comentarios/:aula_id/:questao', 'ComentariosController.store');
    Route_1.default.group(() => {
        Route_1.default.get('questoes-por-dia', 'RelatoriosController.questaoPorDia');
        Route_1.default.get('ranking-questoes-dia', 'RelatoriosController.rankingQuestoesDia');
        Route_1.default.get('tempo-por-dia', 'RelatoriosController.tempoPorDia');
        Route_1.default.get('ranking-tempo-dia', 'RelatoriosController.rankingTempoDia');
        Route_1.default.get('questoes-media/:id', 'RelatoriosController.questoesMedia');
        Route_1.default.get('respondidas-por-disciplina/:id', 'RelatoriosController.respondidasPorDisciplina');
    }).prefix('relatorios');
    Route_1.default.get('views/:view', async ({ params, auth }) => {
        const { view = "" } = params;
        const user_id = auth.user?.id;
        return await Database_1.default.from(view).where({ user_id });
    });
    Route_1.default.get("erros/:dia", 'QuestionsController.erros');
    Route_1.default.get('me', 'AuthController.currentUser');
}).prefix('api')
    .middleware('auth');
Route_1.default.get('/', async () => {
    return { hello: Env_1.default.get("DB_HOST") };
});
//# sourceMappingURL=routes.js.map