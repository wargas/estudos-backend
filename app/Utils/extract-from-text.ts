import Questao from "App/Models/Questao";

export default function extratFromText(_texto: string, aula_id: number) {

    const texto = _texto.replace(/---([\s\r\S]*?)---/g, (_, p1) => {
        return `[comentario]${Buffer.from(p1, 'utf-8').toString('base64')}`
    })


    const [conteudoText, gabaritoText] = texto.split('GABARITO');


    if (!conteudoText || !gabaritoText) {
        throw new Error("ERROR: TEXTO INVALIDO");
    }

    const gabaritos = gabaritoText.split("\n")
        .filter(l => l.match(/\d+\. \w/))
        .map(l => l.trim()
            .replace(/ (ALTERNATIVA|LETRA) /i, " ")
            .replace(/(\d+\.\s)(\w)(ORRETA|RRADA|ORRETO|RRADO)/i, "$1$2"))
        .map(gab => gab.slice(-1))

    const ids = conteudoText.split('\n')
        .find(l => l.startsWith('[UPDATE]'))?.replace('[UPDATE]', '')
        .split(',')


    const questions = conteudoText.replace(/\d{1,3}\. \(/g, "@@@(")
        .replace(/(\n|\s)\(?[a-eA-E]\) /gi, "\n***\n")
        .split('@@@').slice(1)

    if (ids !== undefined && ids.length !== questions.length) {
        throw new Error(`ERROR: IDS: ${ids.length}; QUESTOES: ${gabaritos.length}`);
    }

    if (gabaritos.length !== questions.length) {
        throw new Error(`ERROR: QUESTOES: ${questions.length}; GABARITOS: ${gabaritos.length}`);
    }

    return questions.map((questionText, index) => {
        const question = new Questao()

        const [enunciado, ...alternativas] = questionText
            .split('\n')
            .filter(l => !l.startsWith('[comentario]'))
            .join('\n')
            .split('***')

        const resolucao64 = questionText.split('\n').find(l => l.startsWith('[comentario]')) || ''

        if (ids !== undefined) {
            try {
                question.id = parseInt(ids[index])
            } catch (e) {

            }
        }

        question.resolucao = Buffer.from(resolucao64.replace('[comentario]', ''), 'base64').toString('utf-8')

        question.enunciado = enunciado
        question.gabarito = gabaritos[index]
        question.alternativas = alternativas.length === 0 ? ["Certo", "Errado"] : alternativas,
            question.aula_id = aula_id
        question.modalidade = alternativas.length > 2 ? "MULTIPLA_ESCOLHA" : "CERTO_ERRADO";

        return question;
    })
}