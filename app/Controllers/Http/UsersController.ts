import User from 'App/Models/User'
import Logger from '@ioc:Adonis/Core/Logger'
import Hash from '@ioc:Adonis/Core/Hash'
import File from 'App/Models/File'
import UserValidator from 'App/Validators/UserValidator'

export default class UsersController {
  public async index() {
    return User.all()
  }

  public async store({ request }) {
    Logger.info('Creating new user...')
    await request.validate(UserValidator)
    const user = request.body()
    return User.create(user)
  }

  public async show({ params }) {
    const { id } = params
    const user = await User.findOrFail(id)
    await user.load('files')
    return user
  }

  public async update({ request, params }) {
    await request.validate(UserValidator)
    const { id } = params
    const user = await User.findOrFail(id)
    return await user.merge(request.body()).save()
  }

  public async destroy({ params }) {
    const { id } = params
    const user = await User.findOrFail(id)
    await user.delete()
    File.deleteFolder(id)
  }

  public async login({ request, response, auth }) {
    const email = request.input('email')
    const password = request.input('password')
    const user = await User.findByOrFail('email', email)
    if (!(await Hash.verify(user.password, password))) {
      return response.badRequest('Invalid credentials')
    }
    return await auth.use('api').generate(user)
  }
}
