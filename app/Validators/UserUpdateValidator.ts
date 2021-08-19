import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UserStatus } from 'App/Models/User'

export default class UserUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    id: this.ctx.params.id ? this.ctx.params.id : 0,
  })

  public schema = schema.create({
    id: schema.number([
      rules.unique({ table: 'users', column: 'id', whereNot: { id: this.refs.id } }),
    ]),
    email: schema.string({}, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email', whereNot: { id: this.refs.id } }),
    ]),
    firstname: schema.string(),
    lastname: schema.string(),
    address: schema.string(),
    siret: schema.string(),
    phone: schema.string({}, [rules.mobile({ locales: ['fr-FR'] })]),
    status: schema.enum(Object.values(UserStatus)),
  })

  public messages = {
    'required': 'Le champ {{ field }} est requis.',
    'email.unique': 'Un compte existe déjà pour cette adresse email.',
    'password.regex': 'Le mot de passe ne respecte pas les prérequis.',
    'date.format': 'Le champ {{ field }} ({{ date }}) doit être au format {{ format }}.',
    'phone.mobile': 'Le numéro de téléphone doit être au format mobile.',
  }
}
