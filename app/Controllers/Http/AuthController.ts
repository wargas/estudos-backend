import Env from '@ioc:Adonis/Core/Env';
import Hash from '@ioc:Adonis/Core/Hash';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import { sign } from 'jsonwebtoken';


export default class AuthController {

  async login({ request }: HttpContextContract) {
    const {email, password} = request.all();

    const user = await User.findBy('email', email)

    if(!user) {
      return {error: 'INVALID_CREDENTIALS'}
    }

    if(!await Hash.verify(user.password, password)) {
      return {error: 'INVALID_CREDENTIALS'}
    }

    try {

      const token = await sign({id: user.id}, Env.get('APP_KEY'))

      return { token }
      
    } catch (error) {
      return {error: 'INTERNAL ERROR'}
    }
  }

  async currentUser({user}: HttpContextContract) {
    const user_id = user.id
    return await User.find(user_id)
  }
}
