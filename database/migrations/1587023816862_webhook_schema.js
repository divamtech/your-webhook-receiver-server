'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class WebhookSchema extends Schema {
  up() {
    this.table('webhooks', (table) => {
      // alter table
      table.integer('default_reply_code', 80).defaultTo(200);
    });
  }

  down() {
    this.table('webhooks', (table) => {
      // reverse alternations
      table.dropColumn('default_reply_code');
    });
  }
}

module.exports = WebhookSchema;
