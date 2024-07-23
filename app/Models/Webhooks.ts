import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Webhooks extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name : string

  @column()
  public slug : string

  @column()
  public auth : string

  @column()
  public auth_key1 : string

  @column()
  public auth_key2 : string

  @column()
  public default_reply_code : number

  @column()
  public reply_body : string

  @column()
  public is_active : boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
