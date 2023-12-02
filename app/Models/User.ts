import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave } from '@ioc:Adonis/Lucid/Orm'
import Base from 'App/Models/Base'

export default class User extends Base {
  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string | null

  @column()
  public countryCode: string

  @column()
  public mobileNumber: string

  @column()
  public imageUrl?: string

  @column()
  public isEmailVerify: boolean

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
