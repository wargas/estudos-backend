import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Aula from './Aula'
import Respondida from './Respondida'

export default class Questao extends BaseModel {

  static table = "questoes"

  @column()
  public enunciado: string

  @column()
  public aula_id: number

  @column()
  public banca: string

  @column()
  public gabarito: string

  @column({ isPrimary: true })
  public id: number

  @column()
  public modalidade: string

  @column({
    serialize: (jsonString, _, questao) => {
      
      try {
        const gabarito = questao.$original.gabarito || 'X'
        // const jsonArray = JSON.parse(jsonString);
        const jsonArray = (typeof jsonString) === "string" ?  JSON.parse(jsonString) : jsonString
        const letras = jsonArray.length > 2 ? ['A', 'B', 'C', 'D', 'E'] : ['C', 'E'];

        return jsonArray.map((item, position) => {
          return {
            conteudo: item,
            letra: letras[position],
            correta: letras[position] === gabarito
          }
        })

      } catch (error) {
        return []
      }
    }
  })
  public alternativas: any[]

  @belongsTo(() => Aula, { foreignKey: 'aula_id', localKey: 'id' })
  public aula: BelongsTo<typeof Aula>

  // @hasMany(() => Alternativa, {foreignKey: 'questao_id'})
  // public alternativas: HasMany<typeof Alternativa>

  @hasMany(() => Respondida, { foreignKey: 'questao_id' })
  public respondidas: HasMany<typeof Respondida>
}
