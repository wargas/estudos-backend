"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Questoes extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'respondidas';
    }
    async up() {
        this.schema.table(this.tableName, () => {
        });
    }
    async down() {
        this.schema.table(this.tableName, () => {
        });
    }
}
exports.default = Questoes;
//# sourceMappingURL=1633599812008_questaos.js.map