import { BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm'
import markdownToHtml from 'App/Utils/markdown';

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

}
