import Env from '@ioc:Adonis/Core/Env';
import path from 'path';
import fs from 'fs';

export class ExtractQuestions {

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

        if(opcoes.length == 0){
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

    if(fs.existsSync(file)) {
      const data = fs.readFileSync(file);

      let questions: string[] = data.toString().split('****');

      if(texto.length === 0) {
        questions = questions.filter((_, i) => { return i != index})

      } else {
        questions[index] = texto;
      }

      fs.writeFileSync(file, questions.join("****"));

    }
  }

  static text(_file, index,) {

    const root = Env.get('MD_ROOT', '') + '';

    const file = path.resolve(root, _file);

    if(fs.existsSync(file)) {
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

}
