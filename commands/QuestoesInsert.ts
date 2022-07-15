import { BaseCommand } from '@adonisjs/core/build/standalone';
import { QuestionHelper } from 'App/repositories/QuestionHelper';
import fs from 'fs/promises';
import path from 'path';

export default class QuestoesInsert extends BaseCommand {

  /**
   * Command name is used to run the command
   */
  public static commandName = 'questoes:insert'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

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
    stayAlive: false,
  }


  public async run() {

    const { default: Disciplina } = await import('App/Models/Disciplina');
    const { default: Aula } = await import('App/Models/Aula');
    let disciplina_id = '';
    let aula_id = '';
    let file = 'D:\\CONCURSOS\\SEFAZ-MG\\';

    while (true) {

      if (disciplina_id === '') {
        const spinerA = this.logger.await('Carrengando disciplinas')

        const disciplinas = await Disciplina.all();

        spinerA.stop();
        disciplina_id = await this.prompt.choice<string>(
          'Selecione uma disciplina:',
          disciplinas.map(d => ({ name: d.id, message: d.name })) as [],
          
        );
      }

      if (aula_id === '') {
        const spinerB = this.logger.await('Carrengando aulas')

        const aulas = await Aula.query()
          .preload('questoes')
          .where('disciplina_id', disciplina_id);
        spinerB.stop()

        aula_id = await this.prompt.choice<string>(
          'Selecione a aula:',
          [
            'Voltar',
            ...aulas.map(a => ({
              name: a.id,
              message: `Aula ${a.ordem.toString().padStart(2, '0')} - ${a.name.substring(0, 50)} [${this.colors.cyan(a.questoes.length.toString())}]`
            })) as []]
        )

        if (aula_id === 'Voltar') {
          disciplina_id = '';
          aula_id = ''
          continue;
        }
      }

      

      while (!file.endsWith('.md') || file === 'Voltar') {
        const dirs = (await fs.readdir(file)).map(d => ({ message: d, name: path.join(file, d) }));
        const dir = await this.prompt.choice(
          'Selecione o arquivo',
          [
            { message: '', name: `Voltar` },
            { name: '..', message: '..' },
            ...dirs
          ]
        );

        if (dir === 'Voltar') {
          aula_id = '';
          file = 'Voltar';
          break;
        }

        file = dir === '..' ? path.join(file, '..') : dir;
      }

      if (file === 'Voltar') {
        aula_id = '';
        file = ''
        continue;
      }

      const spinerD = this.logger.await('Carregando dados da aula', undefined, 'aguarde');

      const currentAula = await Aula.query().preload('disciplina').where('id', aula_id).first();

      spinerD.stop()

      if (!currentAula) {
        this.logger.error('Erro ao carregar dados da aula');
        continue;
      }

      this.ui.sticker()
        .add('Confirmar dados')
        .add('')
        .add(`Arquivo:    ${this.colors.cyan(file)}`)
        .add(`Disciplina: ${this.colors.cyan(currentAula?.disciplina.name || '')}`)
        .add(`Aula:       ${this.colors.cyan('Aula ' + currentAula?.ordem.toString().padStart(2, '0') + ' - ' + currentAula?.name.substring(0, 50) || '')}`)
        .render()

      const confirme = await this.prompt.confirm('Confirma os dados?', { default: true });

      if (!confirme) {
        aula_id = ''
        file = path.join(file, '..')
        continue;
      }

      const spinerC = this.logger.await('Salvando questões', undefined, 'aguarde');

      const markdown = (await fs.readFile(file)).toString();

      const insert = await QuestionHelper.editarEmLote(markdown, currentAula.id);

      spinerC.stop()

      this.logger.success(`Concluído: ${insert.length} atualizadas`)
      
      aula_id = ''
      file = path.join(file, '..')

    }

  }
}
