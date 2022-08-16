import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Questao from './Questao'
import Caderno from './Caderno'

export default class CadernoQuestao extends BaseModel {

  static table = 'caderno_questao'

  @column({ isPrimary: true })
  public id: number

  @column() 
  public caderno_id: number

  @column()
  public questao_id: number

  @belongsTo(() => Caderno)
  public caderno: BelongsTo<typeof Caderno>

  @belongsTo(() => Questao)
  public questao: BelongsTo<typeof Questao>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
