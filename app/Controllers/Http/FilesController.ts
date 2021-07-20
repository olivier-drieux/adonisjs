import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import Logger from '@ioc:Adonis/Core/Logger'
import File, { FileType } from 'App/Models/File'
import User from 'App/Models/User'
import FileValidator from 'App/Validators/FileValidator'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import slugify from 'slugify'

export default class FilesController {
  public async index({ params }: HttpContextContract) {
    const { userId } = params
    const user = await User.findOrFail(userId)
    Logger.info(`Getting all files for user n°${userId}`)
    await user.load('files')
    return user.files
  }

  public async show({ params }: HttpContextContract) {
    const { id } = params
    return await File.findOrFail(id)
  }

  public async store({ request, response, params }: HttpContextContract) {
    await request.validate(FileValidator)
    const { userId } = params
    const { type } = request.body()
    const user = await User.findOrFail(userId)
    const file = request.file('file')
    if (!file) {
      return response.badRequest({ code: 111, message: 'No file' })
    }
    Logger.info(`Adding files (${FileType[type]}) to user n°${userId}...`)

    const clientNameSlug = slugify(file.clientName)
    const fileName = `${cuid()}_${clientNameSlug}`
    await file.move(Application.tmpPath(`uploads/${user.id}`), {
      name: fileName,
    })
    return await File.create({
      type,
      path: fileName,
      userId: userId,
    })
  }

  public async destroy({ params }: HttpContextContract) {
    const { id } = params
    const file = await File.findOrFail(id)
    File.deleteFile(file)
    await file.delete()
  }
}
