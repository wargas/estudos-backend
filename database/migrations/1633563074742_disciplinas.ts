import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Disciplinas extends BaseSchema {
  protected tableName = 'disciplinas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name')
      table.integer('user_id')
      table.boolean('arquivada')

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
