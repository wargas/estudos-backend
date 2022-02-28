import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Cadernos extends BaseSchema {
  protected tableName = 'cadernos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.integer('aula_id')
      table.dateTime('inicio')
      table.dateTime('fim')
      table.integer('total')
      table.integer('acertos')
      table.integer('erros')
      table.boolean('encerrado')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
