import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({}, [rules.email()]),
    password: schema.string({}, [
      rules.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
    ]),
  })

  public messages = {
    'required': 'Le champ {{ field }} est requis.',
    'password.regex': 'Le mot de passe ne respecte pas les prérequis.',
  }
}
