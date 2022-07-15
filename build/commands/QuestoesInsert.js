"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const QuestionHelper_1 = global[Symbol.for('ioc.use')]("App/repositories/QuestionHelper");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
class QuestoesInsert extends standalone_1.BaseCommand {
    async run() {
        const { default: Disciplina } = await Promise.resolve().then(() => __importStar(global[Symbol.for('ioc.use')]('App/Models/Disciplina')));
        const { default: Aula } = await Promise.resolve().then(() => __importStar(global[Symbol.for('ioc.use')]('App/Models/Aula')));
        let disciplina_id = '';
        let aula_id = '';
        let file = 'D:\\CONCURSOS\\SEFAZ-MG\\';
        while (true) {
            if (disciplina_id === '') {
                const spinerA = this.logger.await('Carrengando disciplinas');
                const disciplinas = await Disciplina.all();
                spinerA.stop();
                disciplina_id = await this.prompt.choice('Selecione uma disciplina:', disciplinas.map(d => ({ name: d.id, message: d.name })));
            }
            if (aula_id === '') {
                const spinerB = this.logger.await('Carrengando aulas');
                const aulas = await Aula.query()
                    .preload('questoes')
                    .where('disciplina_id', disciplina_id);
                spinerB.stop();
                aula_id = await this.prompt.choice('Selecione a aula:', [
                    'Voltar',
                    ...aulas.map(a => ({
                        name: a.id,
                        message: `Aula ${a.ordem.toString().padStart(2, '0')} - ${a.name.substring(0, 50)} [${this.colors.cyan(a.questoes.length.toString())}]`
                    }))
                ]);
                if (aula_id === 'Voltar') {
                    disciplina_id = '';
                    aula_id = '';
                    continue;
                }
            }
            while (!file.endsWith('.md') || file === 'Voltar') {
                const dirs = (await promises_1.default.readdir(file)).map(d => ({ message: d, name: path_1.default.join(file, d) }));
                const dir = await this.prompt.choice('Selecione o arquivo', [
                    { message: '', name: `Voltar` },
                    { name: '..', message: '..' },
                    ...dirs
                ]);
                if (dir === 'Voltar') {
                    aula_id = '';
                    file = 'Voltar';
                    break;
                }
                file = dir === '..' ? path_1.default.join(file, '..') : dir;
            }
            if (file === 'Voltar') {
                aula_id = '';
                file = '';
                continue;
            }
            const spinerD = this.logger.await('Carregando dados da aula', undefined, 'aguarde');
            const currentAula = await Aula.query().preload('disciplina').where('id', aula_id).first();
            spinerD.stop();
            if (!currentAula) {
                this.logger.error('Erro ao carregar dados da aula');
                continue;
            }
            this.ui.sticker()
                .add('Confirmar dados')
                .add('')
                .add(`Arquivo:    ${this.colors.cyan(file)}`)
                .add(`Disciplina: ${this.colors.cyan(currentAula?.disciplina.name || '')}`)
                .add(`Aula:       ${this.colors.cyan('Aula ' + currentAula?.ordem.toString().padStart(2, '0') + ' - ' + currentAula?.name.substring(0, 50) || '')}`)
                .render();
            const confirme = await this.prompt.confirm('Confirma os dados?', { default: true });
            if (!confirme) {
                aula_id = '';
                file = path_1.default.join(file, '..');
                continue;
            }
            const spinerC = this.logger.await('Salvando questões', undefined, 'aguarde');
            const markdown = (await promises_1.default.readFile(file)).toString();
            const insert = await QuestionHelper_1.QuestionHelper.editarEmLote(markdown, currentAula.id);
            spinerC.stop();
            this.logger.success(`Concluído: ${insert.length} atualizadas`);
            aula_id = '';
            file = path_1.default.join(file, '..');
        }
    }
}
exports.default = QuestoesInsert;
QuestoesInsert.commandName = 'questoes:insert';
QuestoesInsert.description = '';
QuestoesInsert.settings = {
    loadApp: true,
    stayAlive: false,
};
//# sourceMappingURL=QuestoesInsert.js.map