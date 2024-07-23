import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'webhooks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 80).notNullable().unique();
      table.string('slug', 80).notNullable().unique();
      table.string('auth');
      table.string('auth_key1');
      table.string('auth_key2');
      table.integer('default_reply_code', 80).defaultTo(200);
      table.text('reply_body', 'longtext');
      table.boolean('is_active');

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
