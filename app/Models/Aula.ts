import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Disciplina from './Disciplina';
import Respondida from './Respondida';
import Registro from './Registro';
import Questao from './Questao';

export default class Aula extends BaseModel {

  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string;

  @column()
  public ordem: number;

  @column()
  public paginas: number;

  @column()
  public markdown: string;

  @column()
  public user_id: number;

  @column()
  public concurso_id: number;

  @column()
  public disciplina_id: number;


  @hasMany(() => Respondida, {
    foreignKey: 'aula_id'
  })
  public respondidas: HasMany<typeof Respondida>

  @hasMany(() => Registro, {
    foreignKey: 'aula_id'
  })
  public registros: HasMany<typeof Registro>

  @hasMany(() => Questao, {foreignKey: 'aula_id'})
  public questoes: HasMany<typeof Questao>

  @belongsTo(() => Disciplina, {
    foreignKey: 'disciplina_id'
  })
  public disciplina: BelongsTo<typeof Disciplina>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
