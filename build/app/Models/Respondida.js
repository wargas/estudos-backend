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
const Caderno_1 = __importDefault(require("./Caderno"));
const Questao_1 = __importDefault(require("./Questao"));
class Respondida extends Orm_1.BaseModel {
}
__decorate([
    Orm_1.column({ isPrimary: true }),
    __metadata("design:type", Number)
], Respondida.prototype, "id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Respondida.prototype, "aula_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Respondida.prototype, "questao_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Respondida.prototype, "caderno_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Respondida.prototype, "user_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Respondida.prototype, "resposta", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Respondida.prototype, "gabarito", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Boolean)
], Respondida.prototype, "acertou", void 0);
__decorate([
    Orm_1.belongsTo(() => Caderno_1.default),
    __metadata("design:type", Object)
], Respondida.prototype, "caderno", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Respondida.prototype, "horario", void 0);
__decorate([
    Orm_1.belongsTo(() => Questao_1.default, { foreignKey: 'questao_id' }),
    __metadata("design:type", Object)
], Respondida.prototype, "questao", void 0);
exports.default = Respondida;
//# sourceMappingURL=Respondida.js.map