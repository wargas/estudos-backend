"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractQuestions = void 0;
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class ExtractQuestions {
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
}
exports.ExtractQuestions = ExtractQuestions;
//# sourceMappingURL=ExtractQuestions.js.map