import axios, { AxiosInstance } from "axios";
import { JSDOM } from 'jsdom'

const BASE_URL = 'https://www.qconcursos.com/questoes-de-concursos';

class QConcursos {

    key: string;
    http: AxiosInstance;

    constructor(_key: string) {
        this.key = _key;
        this.http = axios.create({
            baseURL: BASE_URL
        })
    }

    async count(): Promise<number> {
        const { data } = await this.http.get(`questoes?${this.key}`);

        const { window: { document } } = new JSDOM(data)

        return parseInt(document.querySelector('.q-page-results-title strong')?.textContent || '')
    }

    public async getQuestionsList(page: number|string): Promise<any[]> {
        const { data } = await this.http.get(`questoes?${this.key}&page=${page}`);
        const { window: { document } } = new JSDOM(data)

        const divQuestions = Array.from(document?.querySelectorAll('.q-question-item'))
        const respostas = document.querySelectorAll('.q-answer')

        const questions = divQuestions.map((divQuestion, index) => {
            const enunciado = divQuestion.querySelector('.q-question-enunciation')?.innerHTML

            
            const alternativas = Array.from(divQuestion.querySelectorAll('.q-question-options>fieldset>div'))
                .map(alternativaDiv => {
                    return {
                        text: alternativaDiv.querySelector('.q-item-enum')?.innerHTML
                    }
                })
            let ano = ''
            let banca = ''
            let orgao = ''

            const divsInfo = divQuestion.querySelectorAll('.q-question-info span')

            ano = (divsInfo[0].textContent || '').replace(/\n/g, "").replace('Ano: ', '').trim()
            banca = (divsInfo[1].textContent || '').replace(/\n/g, "").replace('Banca: ', '').trim()
            orgao = (divsInfo[2].textContent || '').replace(/\n/g, "").replace('Órgão: ', '').trim()

            return {
                header: `${banca} - ${orgao} - ${ano}`,
                enunciado,
                alternativas,
                gabarito: respostas[index].textContent
            }
        })


        return questions
    }

}

export default QConcursos;