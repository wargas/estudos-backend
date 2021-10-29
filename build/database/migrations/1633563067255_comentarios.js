"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Comentarios extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'comentarios';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('aula_id');
            table.integer('questao');
            table.text('texto');
            table.integer('user_id');
            table.integer('questao_id');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Comentarios;
//# sourceMappingURL=1633563067255_comentarios.js.map