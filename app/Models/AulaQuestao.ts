import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Aula from './Aula'
import Questao from './Questao'

export default class AulaQuestao extends BaseModel {

  static table = 'aula_questao'

  @column({ isPrimary: true })
  public id: number

  @column()
  public aula_id: number

  @column() 
  public questao_id: number

  @belongsTo(() => Aula)
  public aula: BelongsTo<typeof Aula>

  @belongsTo(() => Questao)
  public questao: BelongsTo<typeof Questao>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
