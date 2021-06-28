// app/Commands/DbDrop.js command as `adonis db:drop`
// create this command as `adonis make:command db:drop` and paste this code into `app/Commands/DbDrop.js` file and
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

class DbDrop extends Command {
  static get signature() {
    return 'db:drop';
  }

  static get description() {
    return 'Drop database';
  }

  async handle() {
    const config = require(process.cwd() + '/config/database');
    const knex = Knex(config[config.connection]);
    await knex.raw(`DROP DATABASE IF EXISTS ${Env.get('DB_DATABASE')}`);
    await knex.destroy();
    this.info('DB dropped');
  }
}

module.exports = DbDrop;
