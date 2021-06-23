import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { FileType } from 'App/Models/File'

export default class Files extends BaseSchema {
  protected tableName = 'files'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.enum('type', Object.keys(FileType))
      table.string('path').notNullable()
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
