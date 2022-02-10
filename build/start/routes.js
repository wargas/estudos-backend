"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
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
    }).prefix('relatorios');
    Route_1.default.get('me', 'AuthController.currentUser');
}).prefix('api')
    .middleware('auth');
Route_1.default.get('/teste', async () => {
    const users = await User_1.default.query();
    return users;
});
//# sourceMappingURL=routes.js.map