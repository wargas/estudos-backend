"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Registros extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'registros';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.dateTime('horario');
            table.integer('tempo');
            table.integer('user_id');
            table.integer('concurso_id');
            table.integer('disciplina_id');
            table.integer('aula_id');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Registros;
//# sourceMappingURL=1633563088170_registros.js.map