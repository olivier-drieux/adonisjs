import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Auth {
  public async handle({ response, auth, logger }: HttpContextContract, next: () => Promise<void>) {
    logger.info('Trying to authenticate...')
    await auth.use('api').authenticate()
    logger.info(`User ${auth.user} successfuly authenticated.`)
    await next()
  }
}
