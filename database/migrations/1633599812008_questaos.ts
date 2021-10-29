import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Questoes extends BaseSchema {
  protected tableName = 'respondidas'

  public async up () {
    this.schema.table(this.tableName, () => {
     
    })
  }

  public async down () {
    this.schema.table(this.tableName, () => {
      
    })
  }
}
