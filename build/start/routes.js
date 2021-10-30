"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const HealthCheck_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/HealthCheck"));
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Questao_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Questao"));
Event_1.default.on('db:query', query => {
    console.log(query.sql);
});
Route_1.default.post('api/auth/login', 'AuthController.login');
Route_1.default.group(() => {
    Route_1.default.resource('aulas', 'AulasController');
    Route_1.default.post('aulas/insert-lote', 'AulasController.storeLote');
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
    Route_1.default.get('comentarios/:questao_id', 'ComentariosController.show');
    Route_1.default.post('comentarios/:questao_id', 'ComentariosController.store');
    Route_1.default.group(() => {
        Route_1.default.get('dashboard', 'RelatoriosController.dashboard');
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
    const report = await HealthCheck_1.default.getReport();
    return { report };
});
Route_1.default.get('/teste', async () => {
    return await Questao_1.default.all();
});
//# sourceMappingURL=routes.js.map