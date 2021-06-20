import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Logger from '@ioc:Adonis/Core/Logger'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async index() {
    return User.all()
  }

  public async store(ctx: HttpContextContract) {
    Logger.info('Creating new user...')
    await ctx.request.validate(CreateUserValidator)
    const user = ctx.request.body()
    return User.create(user)
  }

  public async show(ctx: HttpContextContract) {
    const { id } = ctx.params
    return await User.findOrFail(id)
  }

  public async update(ctx: HttpContextContract) {
    await ctx.request.validate(UpdateUserValidator)
    const { id } = ctx.params
    const user = ctx.request.body()
    return User.updateOrCreate({ id }, user)
  }

  public async destroy(ctx: HttpContextContract) {
    const { id } = ctx.params
    const user = await User.findOrFail(id)
    await user.delete()
  }
}
