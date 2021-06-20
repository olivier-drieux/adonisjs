import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Logger from '@ioc:Adonis/Core/Logger'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'
import Hash from '@ioc:Adonis/Core/Hash'

export default class UsersController {
  public async index() {
    return User.all()
  }

  public async store({ request }) {
    Logger.info('Creating new user...')
    await request.validate(CreateUserValidator)
    const user = request.body()
    return User.create(user)
  }

  public async show({ params }) {
    const { id } = params
    return await User.findOrFail(id)
  }

  public async update({ request, params }) {
    await request.validate(UpdateUserValidator)
    const { id } = params
    const user = request.body()
    return User.updateOrCreate({ id }, user)
  }

  public async destroy({ params }) {
    const { id } = params
    const user = await User.findOrFail(id)
    await user.delete()
  }

  public async login({ request, response, auth }) {
    const email = request.input('email')
    const password = request.input('password')

    const user = await User.findByOrFail('email', email)

    // Verify password
    if (!(await Hash.verify(user.password, password))) {
      return response.badRequest('Invalid credentials')
    }
    Logger.info('User OK')

    // Generate token
    return await auth.use('api').generate(user)
  }
}
