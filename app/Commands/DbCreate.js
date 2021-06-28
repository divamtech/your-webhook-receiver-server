// app/Commands/DbCreate.js command as `adonis db:create`
// create this command as `adonis make:command db:create` and paste this code into `app/Commands/DbCreate.js` file and
// 👉   Register command as follows
//→ Open start/app.js
//→ Add App/Commands/DbCreate to commands array
//→ const commands = [
//    'App/Commands/DbCreate',
//    'App/Commands/DbDrop'
//  ]

'use strict';

const { Command } = require('@adonisjs/ace');
const Env = use('Env');
const Knex = use('knex');

class DbCreate extends Command {
  static get signature() {
    return 'db:create';
  }

  static get description() {
    return 'Create Database';
  }

  async handle() {
    const config = require(process.cwd() + '/config/database');
    config[config.connection].connection.database = null;
    const knex = Knex(config[config.connection]);
    await knex.raw(`CREATE DATABASE IF NOT EXISTS ${Env.get('DB_DATABASE')}`);
    await knex.destroy();
    this.info('DB created');
  }
}

module.exports = DbCreate;
