import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    const user = await User.find(2)

    if(user) {
      user.merge({
        password: '123456'
      })
      await user.save()
    }



  }
}
