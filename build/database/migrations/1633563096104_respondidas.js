"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Respondidas extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'respondidas';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('aula_id');
            table.datetime('horario');
            table.string('resposta');
            table.string('gabarito');
            table.boolean('acertou');
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
exports.default = Respondidas;
//# sourceMappingURL=1633563096104_respondidas.js.map