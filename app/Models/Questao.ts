import { BaseModel, column, computed, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { QuestionHelper } from 'App/repositories/QuestionHelper'
import markdownToHtml from 'App/Utils/markdown'
import { bancas } from 'Config/bancas'
import { escape } from 'lodash'
import { DateTime } from 'luxon'
import Aula from './Aula'
import Comentario from './Comentario'
import Respondida from './Respondida'


export default class Questao extends BaseModel {

  static table = "questoes"
  helper = new QuestionHelper()


  @column()
  public enunciado: string

  @column()
  public resolucao: string

  @column()
  public aula_id: number

  @column()
  public gabarito: string

  @column({ isPrimary: true })
  public id: number

  @column()
  public modalidade: string

  @computed({serializeAs: 'resolucaoHtml'})
  public get resolucaoHtml() {
    return markdownToHtml(this.resolucao)
  }

  @computed({serializeAs: 'enunciadoHtml'})
  public get enunciadoHtml() {
    return markdownToHtml(this.extractHeader)
  }

  @computed({serializeAs: 'banca'})
  public get extractBanca() {
    return this.helper.getBanca(this.enunciado, bancas)
  }

  @computed({serializeAs: 'texto'})
  public get extractHeader() {
    return this.helper.extractEnunciadoContent(this?.enunciado || '')
  }

  @computed({serializeAs: 'header'})
  public get extractEnunciado() {
    let text = this.helper.extractEnunciadoHeader(this.enunciado)
    try {
      return decodeURIComponent(escape(text))
    } catch (error) {
      return text
    }
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
            html: markdownToHtml(`${item}`),
            letra: letras[position],
            correta: letras[position] === gabarito
          }
        })

      } catch (error) {
        return []
      }
    }
  })
  public alternativas: any[] | string

  @manyToMany(() => Aula)
  public aulas: ManyToMany<typeof Aula>

  @hasMany(() => Respondida, { foreignKey: 'questao_id' })
  public respondidas: HasMany<typeof Respondida>

  @hasMany(() => Comentario, {foreignKey: 'questao_id'})
  public comentarios: HasMany<typeof Comentario>


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime


  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

}
