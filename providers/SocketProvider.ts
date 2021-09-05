import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import cron, { ScheduledTask } from 'node-cron';
/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class SocketProvider {

  public task: ScheduledTask;
  public time = "1 * * * * *"

  constructor (protected app: ApplicationContract) {
    this.task = cron.schedule(this.time, () => {
      this.action()
    })
  }

  public async action() {
    // console.log(this.task)
  }

  public register () {
    // Register your own bindings
  }

  public async boot () {
    const HttpContext = this.app.container.use('Adonis/Core/HttpContext')

    this.task.start()

    HttpContext.getter('socket', () => {
      return { task: this.task };
    }, true)
    // All bindings are ready, feel free to use them
  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
