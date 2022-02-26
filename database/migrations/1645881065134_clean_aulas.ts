import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Aulas extends BaseSchema {
  protected tableName = 'aulas'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumns('paginas', 'markdown', 'questoes')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.integer('paginas')
      table.string('markdown')
      table.integer('questoes')
    })
  }
}
