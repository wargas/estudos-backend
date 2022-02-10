import { ApplicationContract } from '@ioc:Adonis/Core/Application';

export default class AppProvider {
  constructor (protected app: ApplicationContract) {
  }

  public register () {
    //this.app.logger.info('register')
    // Register your own bindings
  }

  public async boot () {
    //this.app.logger.info('boot')
    // IoC container is ready
    
  }

  public async ready () {
    //this.app.logger.info('ready')
  }

  public async shutdown () {
    //this.app.logger.info('shutdown') 
    // Cleanup, since app is going down
  }
}
