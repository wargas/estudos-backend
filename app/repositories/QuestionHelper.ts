import Env from '@ioc:Adonis/Core/Env';
import fs from 'fs';
import path from 'path';

export class QuestionHelper {

  static questions(_file) {
    const root = Env.get('MD_ROOT', '') + '';

    const file = path.resolve(root, _file);

    const opcoesAE = ['A', 'B', 'C', 'D', 'E'];
    const opcoesCE = ['C', 'E'];

    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file);

      return data.toString()
        .replace(/wargasteixeira\.com\.br/g, "157.245.218.108")
        .split('****').map((questao, questao_id) => {
          const split = questao.split('***');

          let _gabarito = split[split.length - 1].trim();
          let gabarito = opcoesAE.indexOf(_gabarito);

          let opcoes = split
            .filter((_, index) => {
              return index > 0 && index < split.length - 1
            })
            .map((texto, index) => {
              return {
                letra: opcoesAE[index],
                texto: texto.trim(),
                correta: gabarito == index
              }
            });

          if (opcoes.length == 0) {
            gabarito = opcoesCE.indexOf(_gabarito)

            opcoes = ['Certo', 'Errado'].map((option, index) => {
              return {
                letra: opcoesCE[index],
                texto: option,
                correta: gabarito == index
              }
            })
          }

          return {
            questao_id,
            aula_id: 0,
            enunciado: split[0].trim(),
            gabarito,
            opcoes,
          }
        });
    } else {
      fs.writeFileSync(file, '');
    }

    return [];
  }

  static edit(_file, index, texto: string) {

    const root = Env.get('MD_ROOT', '') + '';

    const file = path.resolve(root, _file);

    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file);

      let questions: string[] = data.toString().split('****');

      if (texto.length === 0) {
        questions = questions.filter((_, i) => { return i != index })

      } else {
        questions[index] = texto;
      }

      fs.writeFileSync(file, questions.join("****"));

    }
  }

  static text(_file, index,) {

    const root = Env.get('MD_ROOT', '') + '';

    const file = path.resolve(root, _file);

    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file);

      const questions = data.toString().split('****');

      return questions[index];

    }
  }

  static async makeFile(_file, texto) {
    const root = Env.get('MD_ROOT', '') + '';

    const file = path.resolve(root, _file);

    await fs.writeFileSync(file, texto);

    return true;
  }

  getEnunciadoDividerPosition(enunciado: string): number {
    const words = enunciado.split("")
    let compareOpenClose = 0
    let dividerPos = 0

    words.every((word, index) => {
      if (index > 0 && compareOpenClose === 0) {
        dividerPos = index
        return false
      }

      if (word === '(') {
        compareOpenClose++
      }
      if (word === ')') {
        compareOpenClose--
      }

      return true
    })

    return dividerPos
  }

  extractEnunciadoContent(enunciado: string): string {
    return enunciado.substring(this.getEnunciadoDividerPosition(enunciado)).trim()
  }

  extractEnunciadoHeader(enunciado: string): string {
    return enunciado.substr(0, this.getEnunciadoDividerPosition(enunciado))
  }

  getBanca(enunciado: string, bancas): string {

    const header = this.extractEnunciadoHeader(enunciado).toLowerCase()

    const match = bancas.find(({ name }) => header.includes(name.toLowerCase()))

    return match
  }

  static async editarEmLote(markdown: string, aula_id: number) {

    const { default: Database } = await import('@ioc:Adonis/Lucid/Database');
    const { default: Aula } = await import('App/Models/Aula');
    const { default: Questao } = await import('App/Models/Questao');

    const aula = await Aula.findOrFail(aula_id)

    const questoes = markdown.split('****').map(mdQuestao => {
      const partes = mdQuestao.split('***');
      const _gabarito = partes.pop()

      const [_enunciado, ..._alternativas] = partes

      const idRegex = /^\[ID: ?(\d{1,11})\]/
      const matchId = _enunciado.trim().match(idRegex)

      const questaoId = matchId ? matchId[1] : undefined

      const enunciado = _enunciado.trim().replace(idRegex, "")
      const alternativas = JSON.stringify(
        _alternativas.length === 0 ? ['Certo', 'Errado'] : _alternativas.map(alt => alt.trim()))
      const gabarito = _gabarito?.trim()
      const modalidade = alternativas.length > 2 ? 'MULTIPLA_ESCOLHA' : 'CERTO_ERRADO'

      return { enunciado, id: questaoId, alternativas, gabarito, modalidade, aula_id }
    })

    return await Database.transaction(async () => {
      const news = await aula
        .related('questoes')
        .createMany(questoes.filter(it => !it?.id) as [])
      const updated = await Questao
        .updateOrCreateMany(
          'id',
          questoes.filter(it => !!it?.id) as []
        );

      return [...news, ...updated]
    })

  }

}
