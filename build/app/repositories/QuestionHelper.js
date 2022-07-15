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
exports.QuestionHelper = void 0;
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class QuestionHelper {
    static questions(_file) {
        const root = Env_1.default.get('MD_ROOT', '') + '';
        const file = path_1.default.resolve(root, _file);
        const opcoesAE = ['A', 'B', 'C', 'D', 'E'];
        const opcoesCE = ['C', 'E'];
        if (fs_1.default.existsSync(file)) {
            const data = fs_1.default.readFileSync(file);
            return data.toString()
                .replace(/wargasteixeira\.com\.br/g, "157.245.218.108")
                .split('****').map((questao, questao_id) => {
                const split = questao.split('***');
                let _gabarito = split[split.length - 1].trim();
                let gabarito = opcoesAE.indexOf(_gabarito);
                let opcoes = split
                    .filter((_, index) => {
                    return index > 0 && index < split.length - 1;
                })
                    .map((texto, index) => {
                    return {
                        letra: opcoesAE[index],
                        texto: texto.trim(),
                        correta: gabarito == index
                    };
                });
                if (opcoes.length == 0) {
                    gabarito = opcoesCE.indexOf(_gabarito);
                    opcoes = ['Certo', 'Errado'].map((option, index) => {
                        return {
                            letra: opcoesCE[index],
                            texto: option,
                            correta: gabarito == index
                        };
                    });
                }
                return {
                    questao_id,
                    aula_id: 0,
                    enunciado: split[0].trim(),
                    gabarito,
                    opcoes,
                };
            });
        }
        else {
            fs_1.default.writeFileSync(file, '');
        }
        return [];
    }
    static edit(_file, index, texto) {
        const root = Env_1.default.get('MD_ROOT', '') + '';
        const file = path_1.default.resolve(root, _file);
        if (fs_1.default.existsSync(file)) {
            const data = fs_1.default.readFileSync(file);
            let questions = data.toString().split('****');
            if (texto.length === 0) {
                questions = questions.filter((_, i) => { return i != index; });
            }
            else {
                questions[index] = texto;
            }
            fs_1.default.writeFileSync(file, questions.join("****"));
        }
    }
    static text(_file, index) {
        const root = Env_1.default.get('MD_ROOT', '') + '';
        const file = path_1.default.resolve(root, _file);
        if (fs_1.default.existsSync(file)) {
            const data = fs_1.default.readFileSync(file);
            const questions = data.toString().split('****');
            return questions[index];
        }
    }
    static async makeFile(_file, texto) {
        const root = Env_1.default.get('MD_ROOT', '') + '';
        const file = path_1.default.resolve(root, _file);
        await fs_1.default.writeFileSync(file, texto);
        return true;
    }
    getEnunciadoDividerPosition(enunciado) {
        const words = enunciado.split("");
        let compareOpenClose = 0;
        let dividerPos = 0;
        words.every((word, index) => {
            if (index > 0 && compareOpenClose === 0) {
                dividerPos = index;
                return false;
            }
            if (word === '(') {
                compareOpenClose++;
            }
            if (word === ')') {
                compareOpenClose--;
            }
            return true;
        });
        return dividerPos;
    }
    extractEnunciadoContent(enunciado) {
        return enunciado.substring(this.getEnunciadoDividerPosition(enunciado)).trim();
    }
    extractEnunciadoHeader(enunciado) {
        return enunciado.substr(0, this.getEnunciadoDividerPosition(enunciado));
    }
    getBanca(enunciado, bancas) {
        const header = this.extractEnunciadoHeader(enunciado).toLowerCase();
        const match = bancas.find(({ name }) => header.includes(name.toLowerCase()));
        return match;
    }
    static async editarEmLote(markdown, aula_id) {
        const { default: Database } = await Promise.resolve().then(() => __importStar(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database")));
        const { default: Aula } = await Promise.resolve().then(() => __importStar(global[Symbol.for('ioc.use')]('App/Models/Aula')));
        const { default: Questao } = await Promise.resolve().then(() => __importStar(global[Symbol.for('ioc.use')]('App/Models/Questao')));
        const aula = await Aula.findOrFail(aula_id);
        const questoes = markdown.split('****').map(mdQuestao => {
            const partes = mdQuestao.split('***');
            const _gabarito = partes.pop();
            const [_enunciado, ..._alternativas] = partes;
            const idRegex = /^\[ID: ?(\d{1,11})\]/;
            const matchId = _enunciado.trim().match(idRegex);
            const questaoId = matchId ? matchId[1] : undefined;
            const enunciado = _enunciado.trim().replace(idRegex, "");
            const alternativas = JSON.stringify(_alternativas.length === 0 ? ['Certo', 'Errado'] : _alternativas.map(alt => alt.trim()));
            const gabarito = _gabarito?.trim();
            const modalidade = alternativas.length > 2 ? 'MULTIPLA_ESCOLHA' : 'CERTO_ERRADO';
            return { enunciado, id: questaoId, alternativas, gabarito, modalidade, aula_id };
        });
        return await Database.transaction(async () => {
            const news = await aula
                .related('questoes')
                .createMany(questoes.filter(it => !it?.id));
            const updated = await Questao
                .updateOrCreateMany('id', questoes.filter(it => !!it?.id));
            return [...news, ...updated];
        });
    }
}
exports.QuestionHelper = QuestionHelper;
//# sourceMappingURL=QuestionHelper.js.map