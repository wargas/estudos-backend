import { BaseCommand } from '@adonisjs/core/build/standalone'
import Aula from 'App/Models/Aula'

export default class Tests extends BaseCommand {

  /**
   * Command name is used to run the command
   */
  public static commandName = 'tests'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Para testes'

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
  }

  public async run () {
    // const Database = (await import('@ioc:Adonis/Lucid/Database')).default
     // console.log(Object.keys(App))
    // console.log();
    const aula = await Aula.find(1851);

    const questoes = await aula?.related('questoes').query()

    this.logger.info(`${questoes?.length}`);
    
  }
}
