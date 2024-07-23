import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tokens'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.string('token', 255).notNullable().unique().index();
      table.string('type', 80).notNullable();
      table.boolean('is_revoked').defaultTo(false);

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
