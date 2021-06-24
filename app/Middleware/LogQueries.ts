import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from '@ioc:Adonis/Core/Event'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'

export default class LogRequest {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    Event.on('db:query', (query) => {
      if (Application.inProduction) {
        Logger.debug(query.sql)
      } else {
        Database.prettyPrint(query)
      }
    })
    await next()
  }
}
