import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Registros extends BaseSchema {
  protected tableName = 'registros'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.dateTime('horario') // ` datetime DEFAULT NULL,
      table.integer('tempo') // ` int(11) DEFAULT NULL,
      table.integer('user_id') // ` int(11) DEFAULT NULL,
      table.integer('concurso_id') // ` int(11) DEFAULT NULL,
      table.integer('disciplina_id') // ` int(11) DEFAULT NULL,
      table.integer('aula_id') // ` int(11) DEFAULT NULL,

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
