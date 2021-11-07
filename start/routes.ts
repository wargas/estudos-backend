import Events from '@ioc:Adonis/Core/Event';
import Route from '@ioc:Adonis/Core/Route';
import User from 'App/Models/User';


Events.on('db:query', query => {
  console.log(query.sql)
})

Route.post('api/auth/login', 'AuthController.login')

Route.group(() => {
  Route.resource('aulas', 'AulasController');
  Route.post('aulas/insert-lote', 'AulasController.storeLote')

  Route.resource('disciplinas', 'DisciplinasController');

  Route.resource('questoes', 'QuestionsController')
  Route.post('questoes/editar-lote', 'QuestionsController.editarEmLote')
  Route.post('questoes/responder', 'QuestionsController.responder')

  Route.post('questoes/:id/:questao', 'QuestionsController.editar')
  Route.get('questoes/:id/:questao', 'QuestionsController.text')

  Route.get('respondidas/:aula/:questao', 'QuestionsController.respondidas')
  Route.delete('respondidas/:id', 'QuestionsController.deleteRespondida')
  Route.get('respondidas/:aula', 'QuestionsController.respondidas')

  Route.resource('registros', 'RegistrosController');

  Route.get('comentarios/:questao_id', 'ComentariosController.show');
  Route.post('comentarios/:questao_id', 'ComentariosController.store');

  Route.group(() => {
    Route.get('dashboard', 'RelatoriosController.dashboard')
  }).prefix('relatorios');


  Route.get('me', 'AuthController.currentUser')
}).prefix('api')
  .middleware('auth')


Route.get('/teste', async () => {
  const users = await User.query()

  return users
})

