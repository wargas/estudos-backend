import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await User.create({
      email: 'teixeira.wargas@gmail.com',
      password: '123456s',
      name: 'Wargas Teixeira'
    })

  }
}
