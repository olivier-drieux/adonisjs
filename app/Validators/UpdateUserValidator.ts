import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    userId: this.ctx.params.id,
  })

  public schema = schema.create({
    email: schema.string({}, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email', whereNot: { id: this.refs.userId } }),
    ]),
    password: schema.string({}, [
      rules.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
    ]),
  })
  
  public messages = {
	  'email.unique': 'Un compte existe déjà pour cette adresse email.',
	  'password.regex': 'Le mot de passe ne respecte pas les prérequis.',
  }
}
