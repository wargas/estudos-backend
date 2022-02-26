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
const luxon_1 = require("luxon");
const Disciplina_1 = __importDefault(require("./Disciplina"));
const Questao_1 = __importDefault(require("./Questao"));
const Registro_1 = __importDefault(require("./Registro"));
const Respondida_1 = __importDefault(require("./Respondida"));
class Aula extends Orm_1.BaseModel {
    constructor() {
        super(...arguments);
        this.serializeExtras = true;
    }
}
__decorate([
    Orm_1.column({ isPrimary: true }),
    __metadata("design:type", Number)
], Aula.prototype, "id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Aula.prototype, "name", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Aula.prototype, "ordem", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Aula.prototype, "paginas", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Aula.prototype, "markdown", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Aula.prototype, "user_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Aula.prototype, "concurso_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Aula.prototype, "disciplina_id", void 0);
__decorate([
    Orm_1.hasMany(() => Respondida_1.default, {
        foreignKey: 'aula_id'
    }),
    __metadata("design:type", Object)
], Aula.prototype, "respondidas", void 0);
__decorate([
    Orm_1.hasMany(() => Registro_1.default, {
        foreignKey: 'aula_id'
    }),
    __metadata("design:type", Object)
], Aula.prototype, "registros", void 0);
__decorate([
    Orm_1.manyToMany(() => Questao_1.default),
    __metadata("design:type", Object)
], Aula.prototype, "questoes", void 0);
__decorate([
    Orm_1.belongsTo(() => Disciplina_1.default, {
        foreignKey: 'disciplina_id'
    }),
    __metadata("design:type", Object)
], Aula.prototype, "disciplina", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Aula.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Aula.prototype, "updatedAt", void 0);
exports.default = Aula;
//# sourceMappingURL=Aula.js.map