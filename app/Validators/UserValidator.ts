import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    id: this.ctx.params.id ? this.ctx.params.id : 0,
  })

  public schema = schema.create({
    email: schema.string({}, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email', whereNot: { id: this.refs.id } }),
    ]),
    password: schema.string({}, [
      rules.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
    ]),
    firstname: schema.string(),
    lastname: schema.string(),
    address: schema.string(),
    siret: schema.string(),
    phone: schema.string({}, [rules.mobile({ locales: ['fr-FR'] })]),
  })

  public messages = {
    'required': 'Le champ {{ field }} est requis.',
    'email.unique': 'Un compte existe déjà pour cette adresse email.',
    'password.regex': 'Le mot de passe ne respecte pas les prérequis.',
    'date.format': 'Le champ {{ field }} ({{ date }}) doit être au format {{ format }}.',
    'phone.mobile': 'Le numéro de téléphone doit être au format mobile.',
  }
}
