"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
class Job extends standalone_1.BaseCommand {
    async run() {
        this.logger.info('Iniciando');
    }
}
exports.default = Job;
Job.commandName = 'job';
Job.description = 'Faz algo pessado';
Job.settings = {
    loadApp: true,
    stayAlive: true,
};
//# sourceMappingURL=Job.js.map