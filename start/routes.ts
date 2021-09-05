import Route from '@ioc:Adonis/Core/Route'
import Env from '@ioc:Adonis/Core/Env'
import Database from '@ioc:Adonis/Lucid/Database';

Route.post('api/auth/login', 'AuthController.login')

Route.group(() => {
  Route.resource('aulas', 'AulasController');

  Route.resource('disciplinas', 'DisciplinasController');

  Route.resource('questoes', 'QuestionsController')
  Route.post('questoes/editar-lote', 'QuestionsController.editarEmLote')
  Route.post('questoes/upload', 'QuestionsController.upload')
  Route.post('questoes/responder', 'QuestionsController.responder')

  Route.post('questoes/:id/:questao', 'QuestionsController.editar')
  Route.get('questoes/:id/:questao', 'QuestionsController.text')

  Route.get('respondidas/:aula/:questao', 'QuestionsController.respondidas')
  Route.delete('respondidas/:id', 'QuestionsController.deleteRespondida')
  Route.get('respondidas/:aula', 'QuestionsController.respondidas')

  Route.resource('registros', 'RegistrosController');

  Route.get('comentarios/:aula_id/:questao', 'ComentariosController.show');
  Route.post('comentarios/:aula_id/:questao', 'ComentariosController.store');

  Route.group(() => {
    Route.get('questoes-por-dia', 'RelatoriosController.questaoPorDia');
    Route.get('ranking-questoes-dia', 'RelatoriosController.rankingQuestoesDia')
    Route.get('tempo-por-dia', 'RelatoriosController.tempoPorDia');
    Route.get('ranking-tempo-dia', 'RelatoriosController.rankingTempoDia')
    Route.get('questoes-media/:id', 'RelatoriosController.questoesMedia');
    Route.get('respondidas-por-disciplina/:id', 'RelatoriosController.respondidasPorDisciplina');
  }).prefix('relatorios');

  Route.get('views/:view', async ({ params, auth }) => {
    const { view = "" } = params;
    const user_id = auth.user?.id;

    return await Database.from(view).where({ user_id });

  })
  Route.get("erros/:dia", 'QuestionsController.erros')
  Route.get('me', 'AuthController.currentUser')
}).prefix('api')
.middleware('auth')


Route.get('/', async () => {
  return { hello: Env.get("DB_HOST")  }
})