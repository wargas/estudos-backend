import { BaseModel, belongsTo, BelongsTo, column, hasMany, HasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import Caderno from './Caderno';
import Disciplina from './Disciplina';
import Questao from './Questao';
import Registro from './Registro';
import Respondida from './Respondida';

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

  @manyToMany(() => Questao)
  public questoes: ManyToMany<typeof Questao>

  @hasMany(() => Caderno, {foreignKey: 'aula_id'})
  public cadernos: HasMany<typeof Caderno>

  @belongsTo(() => Disciplina, {
    foreignKey: 'disciplina_id'
  })
  public disciplina: BelongsTo<typeof Disciplina>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  
}
