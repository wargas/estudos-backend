import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Questao from './Questao'

export default class Alternativa extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public questao_id: number

  @column()
  public conteudo: string

  @column()
  public letra: string

  @column()
  public correta: boolean

  @column()
  public user_id: number

  @belongsTo(() => Questao, {foreignKey: 'questao_id'})
  public questao: BelongsTo<typeof Questao>
}
