import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
    password: schema.string({}, [
      rules.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
    ]),
  })

  public messages = {
    '*': (field, rule, arrayExpressionPointer, options) => {
      return `${rule} validation error on ${field}`
    },
    'required': 'Le champ {{ field }} est requis pour créer un nouveau compte.',
    'email.unique': 'Un compte existe déjà pour cette adresse email.',
    'password.regex': 'Le mot de passe ne respecte pas les prérequis.',
    'date.format': 'Le champ {{ field }} ({{ date }}) doit être au format {{ format }}',
  }
}
