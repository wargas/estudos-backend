import { BaseModel, BelongsTo, belongsTo, column, computed, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { QuestionHelper } from 'App/repositories/QuestionHelper'
import { bancas } from 'Config/bancas'
import Aula from './Aula'
import Respondida from './Respondida'


export default class Questao extends BaseModel {

  static table = "questoes"
  helper = new QuestionHelper()

  @column()
  public enunciado: string

  @column()
  public aula_id: number

  @column()
  public gabarito: string

  @column({ isPrimary: true })
  public id: number

  @column()
  public modalidade: string

  @computed({serializeAs: 'banca'})
  public get extractBanca() {
    return this.helper.getBanca(this.enunciado, bancas)
  }

  @computed({serializeAs: 'texto'})
  public get extractHeader() {
    return this.helper.extractEnunciadoContent(this.enunciado)
  }

  @computed({serializeAs: 'header'})
  public get extractEnunciado() {
    return this.helper.extractEnunciadoHeader(this.enunciado)
  }

  @column({
    serialize: (jsonString, _, questao) => {
      try {
        const gabarito = questao.$original.gabarito || 'X'
        const jsonArray = (typeof jsonString) === "string" ?  JSON.parse(jsonString) : jsonString
        const letras = Object.values(jsonArray).length > 2 ? ['A', 'B', 'C', 'D', 'E'] : ['C', 'E'];

        return Object.values(jsonArray).map((item, position) => {
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

  @hasMany(() => Respondida, { foreignKey: 'questao_id' })
  public respondidas: HasMany<typeof Respondida>
}
