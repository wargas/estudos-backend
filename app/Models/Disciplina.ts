import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, HasManyThrough, hasManyThrough } from '@ioc:Adonis/Lucid/Orm'
import Aula from './Aula';
import Questao from './Questao';

export default class Disciplina extends BaseModel {

  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string;

  @column()
  public user_id: number;

  @column()
  public concurso_id: number;

  @column()
  arquivada: boolean;

  @hasMany(() => Aula, {
    foreignKey: 'disciplina_id'
  })
  public aulas: HasMany<typeof Aula>

  @hasManyThrough([
    () => Questao,
    () => Aula
  ], {
    throughForeignKey: 'aula_id',
    throughLocalKey: 'id',
    foreignKey: 'disciplina_id'
  })
  public questoes: HasManyThrough<typeof Questao>


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
