import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import markdownToHtml from 'App/Utils/markdown';
import { DateTime } from 'luxon';
import Questao from './Questao';

export default class Comentario extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public questao_id: number;

  @column()
  public user_id: number;

  @column()
  public texto: string;

  @computed()
  public get html() {
    return markdownToHtml(this.texto)
  }

  @belongsTo(() => Questao)
  public questao: BelongsTo<typeof Questao>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

}
