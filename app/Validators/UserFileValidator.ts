import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UserFileType } from 'App/Models/UserFile'

export default class UserFileValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    userId: schema.number(),
    type: schema.enum(Object.keys(UserFileType)),
    file: schema.file({
      size: '10mb',
    }),
  })

  public messages = {}
}
