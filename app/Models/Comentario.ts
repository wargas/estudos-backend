import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Comentario extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public questao_id: number;

  @column()
  public user_id: number;

  @column()
  public texto: string;

}
