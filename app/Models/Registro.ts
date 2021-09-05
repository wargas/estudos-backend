import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Registro extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public horario: DateTime

  @column()
  public tempo: number

  @column()
  public user_id: number

  @column()
  public concurso_id: number

  @column()
  public disciplina_id: number

  @column()
  public aula_id: number


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
