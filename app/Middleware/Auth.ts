import Env from '@ioc:Adonis/Core/Env'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { verify } from 'jsonwebtoken'
export default class AuthMiddleware {


  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {

    const authorization = ctx.request.header('Authorization')
    const token = authorization?.split(' ')[1]
    if (!token) {
      ctx.response.status(401).json({ error: 'UNAUTHORIZED' })
      return;
    }

    const payload = verify(token, Env.get('APP_KEY'))

    if (!payload['id']) {
      ctx.response.status(401).json({ error: 'UNAUTHORIZED' })
      return;
    }

    ctx.user = new User()
    ctx.user.id = payload['id']

    await next()
  }
}
