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
const Aula_1 = __importDefault(require("./Aula"));
const Respondida_1 = __importDefault(require("./Respondida"));
class Caderno extends Orm_1.BaseModel {
}
__decorate([
    Orm_1.column({ isPrimary: true }),
    __metadata("design:type", String)
], Caderno.prototype, "id", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Caderno.prototype, "inicio", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Caderno.prototype, "fim", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Caderno.prototype, "total", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Caderno.prototype, "acertos", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Caderno.prototype, "erros", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Caderno.prototype, "aula_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Boolean)
], Caderno.prototype, "encerrado", void 0);
__decorate([
    Orm_1.belongsTo(() => Aula_1.default),
    __metadata("design:type", Object)
], Caderno.prototype, "aula", void 0);
__decorate([
    Orm_1.hasMany(() => Respondida_1.default),
    __metadata("design:type", Object)
], Caderno.prototype, "respondidas", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Caderno.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Caderno.prototype, "updatedAt", void 0);
exports.default = Caderno;
//# sourceMappingURL=Caderno.js.map