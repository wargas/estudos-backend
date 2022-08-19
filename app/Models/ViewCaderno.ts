import { column } from '@ioc:Adonis/Lucid/Orm'
import Caderno from './Caderno'

export default class ViewCaderno extends Caderno {
    static table = 'view_cadernos'

    @column()
    public finalizado: boolean

    @column()
    public nota: number
}
