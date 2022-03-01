"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Cadernos extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'cadernos';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary();
            table.integer('aula_id');
            table.dateTime('inicio');
            table.dateTime('fim');
            table.integer('total');
            table.integer('acertos');
            table.integer('erros');
            table.boolean('encerrado');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Cadernos;
//# sourceMappingURL=1646063507791_cadernos.js.map