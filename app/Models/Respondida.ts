import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Questao from './Questao';

export default class Respondida extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  aula_id: number;

  @column()
  questao_id: number

  // @column()
  // questao: number;

  @column()
  user_id: number;

  @column()
  resposta: string;

  @column()
  gabarito: string;

  @column()
  acertou: boolean;

  @column.dateTime({autoCreate: true})
  horario: DateTime;

  @belongsTo(() => Questao, {foreignKey: 'questao_id'})
  public questao: BelongsTo<typeof Questao>



}
