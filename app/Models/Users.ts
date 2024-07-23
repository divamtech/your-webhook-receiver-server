import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave } from '@ioc:Adonis/Lucid/Orm'
import Base from 'App/Models/Base'

export default class Users extends Base {
  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @beforeSave()
  public static async hashPassword(user: Users) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
