import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Comentario extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public aula_id: number;

  @column()
  public questao: number;

  @column()
  public texto: string;

}
