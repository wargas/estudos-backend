import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {

  async login({ request, auth }: HttpContextContract) {
    const {email, password} = request.all();

    try {
      return await auth.use('api').attempt(email, password)
    } catch (error) {
      return {error: 'INVALID_CREDENTIALS'}
    }
  }

  async currentUser({auth}: HttpContextContract) {
    return auth.user
  }
}
