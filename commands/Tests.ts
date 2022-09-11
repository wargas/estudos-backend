import { BaseCommand } from "@adonisjs/core/build/standalone";
import Questao from "App/Models/Questao";
import fs from 'fs/promises'
import { chunk }  from 'lodash'

export default class Tests extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = "tests";

  /**
   * Command description is displayed in the "help" output
   */
  public static description = "Para testes";

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process
     */
    stayAlive: true,
  };

  public async run() {
    const fileRead = await fs.readFile('D:\\CONCURSOS\\SEFAZ-MG - Auditor Fiscal - Auditoria e Fiscalizacao\\Auditoria Contábil\\md\\curso-208027-aula-13-b74b-completo.md')

    const aula_id = 1
    let text = fileRead.toString()


    text = text.split('---').map((split: string, index: number) => {
      if(index % 2 === 1) {
        return `[comentario]${Buffer.from(split, 'utf-8').toString('base64')}`
      }
      return split
    }).join('')

    const [conteudoText, gabaritoText] = text.split('GABARITO');

    const gabaritos = gabaritoText.split("\n")
      .filter(l => l.match(/\d+\. \w/))
      .map(l => l.trim()
        .replace(/ (ALTERNATIVA|LETRA) /i, " ")
        .replace(/(\d+\.\s)(\w)(ORRETA|RRADA|ORRETO|RRADO)/i, "$1$2"))
      .map(gab => gab.slice(-1))

    const ids = conteudoText
      .split('\n').find(l => l.startsWith('[UPDATE]'))?.replace('[UPDATE]', '')
      .split(',')

    
    const questionsText = conteudoText.replace(/\d{1,3}\. \(/g, "@@@(")
      .replace(/(\n|\s)\(?[a-eA-E]\) /gi, "\n***\n")
      .split('@@@').slice(1)
    
    

    if(questionsText.length === gabaritos.length) {
      const questions = questionsText.map((questionText, index) => {

        const question = new Questao()

          const [enunciado, ...alternativas] = questionText
            .split('\n')
            .filter(l => !l.startsWith('[comentario]'))
            .join('\n')
            .split('***')

          const resolucao64 = questionText.split('\n').find(l => l.startsWith('[comentario]')) || ''

          question.resolucao = Buffer.from(resolucao64.replace('[comentario]', ''), 'base64').toString('utf-8')
          question.enunciado = enunciado
          question.gabarito = gabaritos[index]
          question.alternativas = alternativas.length === 0 ? ["Certo", "Errado"] : alternativas,
          question.aula_id = aula_id
          question.modalidade = alternativas.length > 2 ? "MULTIPLA_ESCOLHA" : "CERTO_ERRADO";

          return question;

      })

    }


    
    await fs.writeFile('D:\\CONCURSOS\\SEFAZ-MG - Auditor Fiscal - Auditoria e Fiscalizacao\\Auditoria Contábil\\md\\parsed.md', questionsText[0])
    

    
  }

  
}
