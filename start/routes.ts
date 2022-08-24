import Events from "@ioc:Adonis/Core/Event";
import Route from "@ioc:Adonis/Core/Route";
import ViewDisciplina from "App/Models/ViewDisciplina";
import QConcursos from "App/Utils/Qconcursos";

Events.on("db:query", (query) => {
  console.log(query.sql);
});

Route.post("api/auth/login", "AuthController.login");

Route.group(() => {
  Route.resource("disciplinas", "DisciplinasController");
  Route.resource("disciplinas.aulas", "AulasController");
  Route.resource("aulas", "AulasController");
  Route.resource("aulas.questoes", "QuestionsController");
  Route.resource("questoes", "QuestionsController");
  Route.resource('questoes/:questao_id/comentarios', 'ComentariosController')
  Route.resource('questoes/:questao_id/respondidas', 'RespondidasController')
  Route.resource('comentarios', 'ComentariosController')
  Route.resource("aulas.registros", "RegistrosController");
  Route.resource("registros", "RegistrosController");
  Route.resource("aulas.cadernos", "CadernosController");
  Route.resource("cadernos", "CadernosController");
  Route.resource("cadernos.questoes", "QuestionsController");

  Route.post("aulas/insert-lote", "AulasController.storeLote");
  Route.post("questoes/editar-lote", "QuestionsController.editarEmLote");
  Route.post("questoes/responder", "QuestionsController.responder");

  Route.post("questoes/:id/:questao", "QuestionsController.editar");
  Route.get("questoes/:id/:questao", "QuestionsController.text");
  Route.post('questoes/prepare', 'QuestionsController.prepareFromFile')

  Route.get("respondidas/:aula/:questao", "QuestionsController.respondidas");
  Route.delete("respondidas/:id", "QuestionsController.deleteRespondida");
  Route.get("respondidas/:aula", "QuestionsController.respondidas");

  Route.get("comentarios/:questao_id", "ComentariosController.show");
  Route.post("comentarios/:questao_id", "ComentariosController.store");

  Route.group(() => {
    Route.get("dashboard", "RelatoriosController.dashboard");
  }).prefix("relatorios");

  Route.post('qconcursos/count', 'QconcursosController.getPages')
  Route.post('qconcursos/list', 'QconcursosController.listQuestions')

  Route.get("me", "AuthController.currentUser");
})
  .prefix("api")
  .middleware("auth");

Route.get("/teste", async () => {
  const q = new QConcursos('discipline_ids[]=18&examining_board_ids[]=63');

  const list = await q.getQuestionsList(1)

  return list;
});
