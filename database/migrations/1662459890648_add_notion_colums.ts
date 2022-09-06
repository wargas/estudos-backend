import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Aulas extends BaseSchema {
  protected tableName = 'aulas'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.string('notion_id').after('disciplina_id')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('notion_id')
    })
  }
}
