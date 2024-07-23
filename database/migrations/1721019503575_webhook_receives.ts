import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'webhook_receives'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.integer('webhook_id').unsigned().references('id').inTable('webhooks');
      table.text('request_headers', 'longtext');
      table.text('request_body', 'longtext');
      table.integer('reply_code', 80);
      table.text('reply_body', 'longtext');

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
