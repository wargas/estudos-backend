"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const QuestionHelper_1 = global[Symbol.for('ioc.use')]("App/repositories/QuestionHelper");
const markdown_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Utils/markdown"));
const bancas_1 = global[Symbol.for('ioc.use')]("Config/bancas");
const lodash_1 = require("lodash");
const luxon_1 = require("luxon");
const Aula_1 = __importDefault(require("./Aula"));
const Comentario_1 = __importDefault(require("./Comentario"));
const Respondida_1 = __importDefault(require("./Respondida"));
class Questao extends Orm_1.BaseModel {
    constructor() {
        super(...arguments);
        this.helper = new QuestionHelper_1.QuestionHelper();
    }
    get resolucaoHtml() {
        return markdown_1.default(this.resolucao);
    }
    get enunciadoHtml() {
        return markdown_1.default(this.extractHeader);
    }
    get extractBanca() {
        return this.helper.getBanca(this.enunciado, bancas_1.bancas);
    }
    get extractHeader() {
        return this.helper.extractEnunciadoContent(this?.enunciado || '');
    }
    get extractEnunciado() {
        let text = this.helper.extractEnunciadoHeader(this.enunciado);
        try {
            return decodeURIComponent(lodash_1.escape(text));
        }
        catch (error) {
            return text;
        }
    }
}
Questao.table = "questoes";
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Questao.prototype, "enunciado", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Questao.prototype, "resolucao", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Questao.prototype, "aula_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Questao.prototype, "gabarito", void 0);
__decorate([
    Orm_1.column({ isPrimary: true }),
    __metadata("design:type", Number)
], Questao.prototype, "id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Questao.prototype, "modalidade", void 0);
__decorate([
    Orm_1.computed({ serializeAs: 'resolucaoHtml' }),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Questao.prototype, "resolucaoHtml", null);
__decorate([
    Orm_1.computed({ serializeAs: 'enunciadoHtml' }),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Questao.prototype, "enunciadoHtml", null);
__decorate([
    Orm_1.computed({ serializeAs: 'banca' }),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Questao.prototype, "extractBanca", null);
__decorate([
    Orm_1.computed({ serializeAs: 'texto' }),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Questao.prototype, "extractHeader", null);
__decorate([
    Orm_1.computed({ serializeAs: 'header' }),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Questao.prototype, "extractEnunciado", null);
__decorate([
    Orm_1.column({
        serialize: (jsonString, _, questao) => {
            try {
                const gabarito = questao.$original.gabarito || 'X';
                const jsonArray = (typeof jsonString) === "string" ? JSON.parse(jsonString) : jsonString;
                const letras = Object.values(jsonArray).length > 2 ? ['A', 'B', 'C', 'D', 'E'] : ['C', 'E'];
                return Object.values(jsonArray).map((item, position) => {
                    return {
                        conteudo: item,
                        html: markdown_1.default(`${item}`),
                        letra: letras[position],
                        correta: letras[position] === gabarito
                    };
                });
            }
            catch (error) {
                return [];
            }
        }
    }),
    __metadata("design:type", Object)
], Questao.prototype, "alternativas", void 0);
__decorate([
    Orm_1.manyToMany(() => Aula_1.default),
    __metadata("design:type", Object)
], Questao.prototype, "aulas", void 0);
__decorate([
    Orm_1.hasMany(() => Respondida_1.default, { foreignKey: 'questao_id' }),
    __metadata("design:type", Object)
], Questao.prototype, "respondidas", void 0);
__decorate([
    Orm_1.hasMany(() => Comentario_1.default, { foreignKey: 'questao_id' }),
    __metadata("design:type", Object)
], Questao.prototype, "comentarios", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Questao.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Questao.prototype, "updatedAt", void 0);
exports.default = Questao;
//# sourceMappingURL=Questao.js.map