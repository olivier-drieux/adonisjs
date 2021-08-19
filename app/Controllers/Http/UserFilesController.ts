import { UserFileStatus } from './../../Models/UserFile'
import UserFileValidator from 'App/Validators/UserFileValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import Logger from '@ioc:Adonis/Core/Logger'
import UserFile, { UserFileType } from 'App/Models/UserFile'
import User from 'App/Models/User'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import slugify from 'slugify'

export default class UserFilesController {
  public async index({ params }: HttpContextContract) {
    const { userId } = params
    Logger.info(`Getting all files for user n°${userId}`)
    const files = await UserFile.query().where('userId', '=', userId)
    return files
  }

  public async show({ params }: HttpContextContract) {
    const { id } = params
    return await UserFile.findOrFail(id)
  }

  public async store({ request, response }: HttpContextContract) {
    const { type, userId } = await request.validate(UserFileValidator)
    const user = await User.findOrFail(userId)
    const file = request.file('file')
    if (!file) {
      return response.badRequest({ code: 111, message: 'No file' })
    }
    Logger.info(`Adding files (${UserFileType[type]}) to user n°${userId}...`)

    const clientNameSlug = slugify(file.clientName)
    const fileName = `${cuid()}_${clientNameSlug}`
    await file.move(Application.tmpPath(`uploads/user-file/${user.id}`), {
      name: fileName,
    })
    return await UserFile.create({
      type: UserFileType[type],
      name: fileName,
      userId: userId,
      status: UserFileStatus.AWAITING,
    })
  }

  public async destroy({ params }: HttpContextContract) {
    const { id } = params
    Logger.info(`Deleting file n°${id}...`)
    const file = await UserFile.findOrFail(id)
    await file.delete()
  }
}
