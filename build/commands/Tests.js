"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
class Tests extends standalone_1.BaseCommand {
    async run() {
    }
}
exports.default = Tests;
Tests.commandName = "tests";
Tests.description = "Para testes";
Tests.settings = {
    loadApp: true,
    stayAlive: true,
};
//# sourceMappingURL=Tests.js.map