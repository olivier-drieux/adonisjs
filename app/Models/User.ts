import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import File from './File'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public firstname: string

  @column()
  public lastname: string

  @column()
  @slugify({
    strategy: 'shortId',
    fields: ['firstname', 'lastname'],
  })
  public slug: string

  @column()
  public address: string

  @column()
  public siret: string

  @column()
  public phone: string

  @hasMany(() => File)
  public files: HasMany<typeof File>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  public get fullname() {
    return `${this.firstname} ${this.lastname}`
  }

  public toString(): string {
    return `${this.fullname} (${this.id})`
  }
}
