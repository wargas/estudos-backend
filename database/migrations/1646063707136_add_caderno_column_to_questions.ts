import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Questoes extends BaseSchema {
  protected tableName = 'respondidas'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.string('caderno_id').after('id')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('caderno_id')
    })
  }
}
