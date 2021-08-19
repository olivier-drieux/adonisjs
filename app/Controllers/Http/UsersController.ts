import Logger from '@ioc:Adonis/Core/Logger'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import UserFile from 'App/Models/UserFile'
import UserValidator from 'App/Validators/UserValidator'
import LoginValidator from 'App/Validators/LoginValidator'
import Mail from '@ioc:Adonis/Addons/Mail'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import UserUpdateValidator from 'App/Validators/UserUpdateValidator'

export default class UsersController {
  public async index() {
    return User.all()
  }

  public async store({ request }: HttpContextContract) {
    const validated = await request.validate(UserValidator)
    const user = await User.create(validated)
    console.log('User created:', user)
    if (user) {
      await Mail.sendLater((message) => {
        message
          .from('info@aquit-construction.fr')
          .to('mellie39@ethereal.email')
          .subject('Welcome Onboard!')
          .htmlView('emails/account_created', {
            user,
          })
      })
    }
    return user
  }

  public async show({ params }: HttpContextContract) {
    const { id } = params
    const user = await User.findOrFail(id)
    await user.load('files')
    return user
  }

  public async getBy({ request }: HttpContextContract) {
    const { by, value } = request.body()
    const user = await User.findBy(by, value)
    return user
  }

  public async getByEmail({ request }: HttpContextContract) {
    const { email } = request.body()
    console.log('GetByEmail', email)
    const user = await User.findBy('email', email)
    return { email, exists: user !== null }
  }

  public async update(ctx: HttpContextContract) {
    const { request, response, params } = ctx
    const { id } = params
    Logger.info(`Updating user n°${id}...`)
    const userValidated = await request.validate(UserUpdateValidator)
    const user = await User.findOrFail(id)
    if (user.id !== userValidated.id) {
      return response.unauthorized()
    }
    return await user.merge(userValidated).save()
  }

  public async destroy({ params }: HttpContextContract) {
    const { id } = params
    const user = await User.findOrFail(id)
    await user.delete()
    UserFile.deleteFolder(id)
  }

  public async login({ request, response, auth }: HttpContextContract) {
    await request.validate(LoginValidator)
    const email = request.input('email')
    const password = request.input('password')
    const user = await User.findByOrFail('email', email)
    if (!(await Hash.verify(user.password, password))) {
      return response.badRequest({ code: 111, message: 'Invalid credentials' })
    }
    const { token } = await auth.use('api').generate(user)
    return { user, token }
  }

  public async logout({ auth }) {
    await auth.use('api').logout()
  }

  public async auth({ request }: HttpContextContract) {
    const { token } = request.body()
    Logger.info(`Searching user by token ${token}`)
    const user = await User.findByOrFail('token', token)
    return { user }
  }
}
