import { UserFileStatus } from './../../app/Models/UserFile'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { UserFileType } from 'App/Models/UserFile'

export default class Files extends BaseSchema {
  protected tableName = 'user_files'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.enum('type', Object.keys(UserFileType))
      table.string('name').notNullable()
      table.enum('status', Object.keys(UserFileStatus))
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
