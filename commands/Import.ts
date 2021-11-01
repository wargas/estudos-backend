import { BaseCommand } from '@adonisjs/core/build/standalone';
import Database from '@ioc:Adonis/Lucid/Database';
import Questao from 'App/Models/Questao';

export default class Import extends BaseCommand {

  /**
   * Command name is used to run the command
   */
  public static commandName = 'import'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process
     */
    stayAlive: true,
  }

  public async run() {

    // const Database = await (await import('@ioc:Adonis/Lucid/Database')).default;
    const Redis = await (await import('@ioc:Adonis/Addons/Redis')).default
    const images = require(this.application.tmpPath('images.json'))

    for await(let img of images) {
      
      const redisImage = await Redis.get(img.url)

      if(redisImage) {

        const questoes = await Database.from('questoes').where('alternativas', 'like', `%${img.url}%`)

        for await(let questao of questoes) {
          await Questao.query()
            .where('id', questao.id)
            .update({
              alternativas: questao.alternativas.replaceAll(img.url, redisImage)
            })

            console.log(`update questao: ${questao.id}`)
        }
        
      }
      
    }


    // const [questoes] = await Database.rawQuery(`SELECT * from questoes WHERE enunciado LIKE '%![](%' OR alternativas  LIKE '%![](%'`)

    // console.log(questoes.length)

    // await Database.rawQuery('TRUNCATE alternativas')
    // await Database.rawQuery('TRUNCATE questoes')

    // const aulas = await Database.from('aulas')
    //   .where('disciplina_id', '!=',  '54')
    //   .select('id')


    // let questao_id = 1;
    // for await (let aula of aulas) {
    //   const { data } = await axios.get(`https://estudos.deltex.work/api/questoes/${aula.id}`, {
    //     headers: {
    //       'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjI3NDY0MzEwfQ.HTZ28NKIx7tzaaJy9h-V9QaPRoEI9tCO6aEYeDBQEuk'
    //     },
    //     httpsAgent: new https.Agent({
    //       rejectUnauthorized: false
    //     })
    //   })

    //   const questoes = data.map(item => {

    //     item.opcoes = item.opcoes.map(opcao => {
    //       return {
    //         questao_id: questao_id,
    //         correta: opcao.correta ? '1' : '0',
    //         conteudo: opcao.texto,
    //         letra: opcao.letra
    //       };
    //     })

    //     const correta = item.opcoes.find(_item => _item.correta === '1')

    //     item.modalidade = item.opcoes.length > 2 ? 'MULTIPLA_ESCOLA' : 'CERTO_ERRADO'
    //     item.gabarito = correta?.letra || "X"
    //     item.id = questao_id
    //     questao_id++;

    //     return item;
    //   })

    //   const opcoes = questoes.reduce((acc, item) => {
    //     return [...acc, ...item.opcoes]
    //   }, [])

    //   try {
    //     await Database.table('alternativas').multiInsert(opcoes)
    //   } catch (error) {
    //     console.log(error.sqlMessage)
    //   }

    //   try {
    //     await Database.table('questoes').multiInsert(questoes.map(item => {
    //       return {
    //         id: item.id,
    //         enunciado: item.enunciado,
    //         aula_id: aula.id,
    //         modalidade: item.modalidade,
    //         position: item.questao_id,
    //         gabarito: item.gabarito
    //       }
    //     }))
    //   } catch (error) {
    //     console.log(error.sqlMessage)
    //   }

    //   this.logger.info(`${aulas.indexOf(aula)}/${aulas.length}`)

    // }

    // const questoes = await Database.from('questoes').select(['id'])
    // this.logger.info(`${questoes.length} questoes encontradas`)
    // const alternativas = await Database.from('alternativas').orderBy('letra', 'asc').select(['conteudo', 'questao_id']);
    // this.logger.info(`${alternativas.length} alternativas encontradas`)
    // for await (let questao of questoes) {
    //   const _alternativas = alternativas
    //     .filter(alt => alt.questao_id === questao.id)
    //     .map(alt => alt.conteudo)
      
    //   const alternativasValue = JSON.stringify(_alternativas)

    //   await Database.from('questoes')
    //     .where('id', questao.id)
    //     .update({alternativas: alternativasValue})

    //   process.stdout.write(`\rAtualizado [${questoes.indexOf(questao)+1}/${questoes.length}]`)
    // }

    // for await (let questao of questoes) {
    //   try {

    //     await Database.from('comentarios')
    //       .where('aula_id', questao.aula_id)
    //       .where('questao', questao.position)
    //       .update({ questao_id: questao.id })

    //     await Database.from('respondidas')
    //       .where('aula_id', questao.aula_id)
    //       .where('questao', questao.position)
    //       .update({
    //         questao_id: questao.id,
    //         gabarito: questao.gabarito,
    //         modalidade: questao.modalidade
    //       })

    //     this.logger.info(`atualizado: ${questoes.indexOf(questao)}/${questoes.length}`)

    //   } catch (error) {
    //     this.logger.info(`${error.sqlMessage} erro na questao ${questao.id}`)
    //   }
    // }

    // this.logger.info(questoes.length + '')
  }
}
