import { BaseCommand } from '@adonisjs/core/build/standalone'

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
    const App = (await import('@ioc:Adonis/Core/Application')).default

    // console.log(Object.keys(App))
    // console.log();

    const value = "wargásç delmonde steixeira #"
      .normalize("NFD")
      .replace(/./g, function(str)  {
        const charCode = str.charCodeAt(0)

        console.log(charCode)

        if(charCode > 760) {
          return ''
        }

        return str
      })

    this.logger.info(value+'')
    
  }
}
