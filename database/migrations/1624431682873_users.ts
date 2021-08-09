import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { UserStatus } from 'App/Models/User'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable()
      table.string('password', 180).notNullable()
      table.string('firstname').notNullable()
      table.string('lastname').notNullable()
      table.string('slug').notNullable()
      table.string('address').notNullable()
      table.string('siret').notNullable()
      table.string('phone').notNullable()
      table.enum('status', Object.values(UserStatus)).defaultTo(UserStatus.CREATED).notNullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
