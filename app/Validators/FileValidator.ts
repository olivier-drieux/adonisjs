import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { FileType } from 'App/Models/File'

export default class FileValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    type: schema.enum(Object.keys(FileType)),
    file: schema.file({
      size: '10mb',
    }),
  })

  public messages = {}
}
