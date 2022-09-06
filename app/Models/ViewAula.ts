import { HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import Aula from './Aula';
import ViewCaderno from './ViewCaderno';


export default class ViewAula extends Aula {

  
  static table = "view_aulas"

  @hasMany(() => ViewCaderno, {foreignKey: 'aula_id'})
  public cadernos: HasMany<typeof ViewCaderno>

}
