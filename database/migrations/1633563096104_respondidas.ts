import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Respondidas extends BaseSchema {
  protected tableName = 'respondidas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('aula_id') // ` int(11) DEFAULT NULL,
      table.datetime('horario') // ` datetime DEFAULT NULL,
      table.string('resposta') // ` varchar(11) DEFAULT NULL,
      table.string('gabarito') // ` varchar(11) DEFAULT NULL,
      table.boolean('acertou') // ` int(1) DEFAULT NULL,
      table.integer('user_id') // ` int(11) NOT NULL DEFAULT '0',
      table.integer('questao_id') // ` int(11) DEFAULT NULL,

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
