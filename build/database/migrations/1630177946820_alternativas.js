"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Alternativas extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'alternativas';
    }
    async up() {
        this.schema.createTableIfNotExists(this.tableName, (table) => {
            table.increments('id');
            table.integer('questao_id');
            table.text('conteudo');
            table.string('letra');
            table.boolean('correta');
            table.charset('utf8');
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Alternativas;
//# sourceMappingURL=1630177946820_alternativas.js.map