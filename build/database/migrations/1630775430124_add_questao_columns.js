"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Questoes extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'questoes';
    }
    async up() {
        this.schema.table(this.tableName, (table) => {
            table.json('alternativas');
        });
    }
    async down() {
        this.schema.table(this.tableName, (table) => {
            table.dropColumn('alternativas');
        });
    }
}
exports.default = Questoes;
//# sourceMappingURL=1630775430124_add_questao_columns.js.map