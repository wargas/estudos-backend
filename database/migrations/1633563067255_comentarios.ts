import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Comentarios extends BaseSchema {
  protected tableName = 'comentarios'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('aula_id') // ` int(11) DEFAULT NULL,
      table.integer('questao') // ` int(11) DEFAULT NULL,
      table.text('texto') // ` text,
      table.integer('user_id') // ` int(11) NOT NULL DEFAULT '0',
      table.integer('questao_id') // ` int(11) NOT NULL,

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
