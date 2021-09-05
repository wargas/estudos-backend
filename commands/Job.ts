import { BaseCommand } from '@adonisjs/core/build/standalone'


export default class Job extends BaseCommand {

  /**
   * Command name is used to run the command
   */
  public static commandName = 'job'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Faz algo pessado'

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



    this.logger.info('Iniciando');


  }
}
