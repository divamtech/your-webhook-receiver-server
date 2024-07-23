import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class WebhookReceive extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  webhook_id : number

  @column()
  request_headers : string

  @column()
  request_body : string

  @column()
  reply_code : number

  @column()
  reply_body : string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
