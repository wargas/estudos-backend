"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Aulas extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'aulas';
    }
    async up() {
        this.schema.table(this.tableName, (table) => {
            table.dropColumns('paginas', 'markdown', 'questoes');
        });
    }
    async down() {
        this.schema.table(this.tableName, (table) => {
            table.integer('paginas');
            table.string('markdown');
            table.integer('questoes');
        });
    }
}
exports.default = Aulas;
//# sourceMappingURL=1645881065134_clean_aulas.js.map