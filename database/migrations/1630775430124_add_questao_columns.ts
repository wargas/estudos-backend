import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Questoes extends BaseSchema {
  protected tableName = 'questoes'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.json('alternativas')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('alternativas')
    })
  }
}
