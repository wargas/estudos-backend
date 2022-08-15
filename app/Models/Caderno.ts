import { BaseModel, belongsTo, BelongsTo, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Aula from './Aula'
import Questao from './Questao'
import Respondida from './Respondida'

export default class Caderno extends BaseModel {
  public serializeExtras = true
  
  @column({ isPrimary: true })
  public id: number

  @column.dateTime()
  public inicio: DateTime

  @column.dateTime()
  public fim: DateTime

  @column()
  public total: number

  @column()
  public acertos: number

  @column()
  public erros: number

  @column()
  public aula_id: number

  @column()
  public encerrado: boolean

  @manyToMany(() => Questao)
  public questoes: ManyToMany<typeof Questao>

  @belongsTo(() => Aula)
  public aula: BelongsTo<typeof Aula>

  @hasMany(() => Respondida, { foreignKey: 'caderno_id'})
  public respondidas: HasMany<typeof Respondida>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
