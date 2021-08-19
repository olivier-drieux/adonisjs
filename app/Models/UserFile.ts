import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import fs from 'fs-extra'
import Application from '@ioc:Adonis/Core/Application'

export default class UserFile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: UserFileType

  @column()
  public name: string

  @column()
  public userId: number

  @column()
  public status: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public delete() {
    fs.remove(Application.tmpPath(`uploads/${this.userId}`) + `/${this.name}`)
    return super.delete()
  }

  public static deleteFolder(userId: number) {
    fs.remove(Application.tmpPath(`uploads/${userId}`))
  }
}

export enum UserFileType {
  INSURANCE = 'INSURANCE',
  KBIS = 'KBIS',
  FOREIGN_WORKER = 'FOREIGN_WORKER',
}

export enum UserFileStatus {
  AWAITING = 'AWAITING',
  VALID = 'VALID',
  INVALID = 'INVALID',
}
