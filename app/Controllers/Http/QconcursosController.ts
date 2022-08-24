import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import QConcursos from 'App/Utils/Qconcursos'

export default class QconcursosController {


   async getPages({ request }: HttpContextContract) {
    const { query } = request.all()

    const qconcursos = new QConcursos(query);

    const total = await qconcursos.count()


    return { total }

   }

   async listQuestions({request}: HttpContextContract) {
    const { query, page } = request.all()

    const qconcursos = new QConcursos(query);

    return qconcursos.getQuestionsList(page);

   }

}
