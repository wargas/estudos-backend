import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Alternativas extends BaseSchema {
  protected tableName = 'alternativas'

  public async up () {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments('id')
      table.integer('questao_id')
      table.text('conteudo')
      table.string('letra')
      table.boolean('correta')
      table.charset('utf8')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
