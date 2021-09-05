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
        this.schema.createTableIfNotExists(this.tableName, (table) => {
            table.increments('id');
            table.text('enunciado');
            table.integer('aula_id');
            table.integer('position');
            table.string('banca').defaultTo('');
            table.charset('utf8');
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Questoes;
//# sourceMappingURL=1630177939352_questoes.js.map