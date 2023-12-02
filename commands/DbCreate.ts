import { BaseCommand } from '@adonisjs/core/build/standalone'
import Knex from 'knex'

export default class DbCreate extends BaseCommand {
  public static commandName = 'db:create'
  public static description = 'create database'

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run(): Promise<void> {
    const { default: env } = await import('@ioc:Adonis/Core/Env')
    const { default: config } = await import('@ioc:Adonis/Core/Config')
    const connName = env.get('DB_CONNECTION')
    const conn = config.get('database.connections')[connName]
    const envDBName = env.get(`${connName.toUpperCase()}_DB_NAME`)

    const dbName = envDBName
    try {
      conn.connection.database = null
      const knex = Knex(conn)
      await knex.raw(`CREATE DATABASE ${dbName}`)
      await knex.destroy()
      this.logger.info(`DB (${dbName}) created`)
    } catch (e) {
      if (e.code === 'ER_DB_CREATE_EXISTS') {
        this.logger.error(`DB (${dbName}) already exist`)
      } else {
        this.logger.error(e)
      }
    }
  }
}
