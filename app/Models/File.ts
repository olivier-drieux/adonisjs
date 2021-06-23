import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import fs from 'fs-extra'
import Application from '@ioc:Adonis/Core/Application'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: FileType

  @column()
  public path: string

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static deleteFile(file: File) {
    fs.remove(Application.tmpPath(`uploads/${file.userId}`) + `/${file.path}`)
  }

  public static deleteFolder(userId: number) {
    fs.remove(Application.tmpPath(`uploads/${userId}`))
  }
}

export enum FileType {
  INSURANCE = "Justificatif d'assurance",
  KBIS = 'K-bis',
  FOREIGN_WORKER = "Justificatifs d'emplois étrangers",
  OTHER = 'Autre',
}
