import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Questaos extends BaseSchema {
  protected tableName = 'questoes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('modalidade') // ` varchar(100) NOT NULL,
      table.text('enunciado') // ` text,
      table.string('gabarito') // ` varchar(2) NOT NULL,
      table.integer('aula_id') // ` int(11) DEFAULT NULL,
      table.integer('position') // ` int(11) DEFAULT NULL,
      table.string('banca').defaultTo('') // ` varchar(255) DEFAULT '',
      table.text('alternativas') // ` json DEFAULT NULL,

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
