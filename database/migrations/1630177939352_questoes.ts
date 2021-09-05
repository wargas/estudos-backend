import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Questoes extends BaseSchema {
  protected tableName = 'questoes'

  public async up () {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id')
      table.text('enunciado')
      table.integer('aula_id')
      table.integer('position')
      table.string('banca').defaultTo('')
      table.charset('utf8')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
