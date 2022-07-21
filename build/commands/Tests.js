"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const markdown_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Utils/markdown"));
class Tests extends standalone_1.BaseCommand {
    async run() {
        const text = "$1 + 2$";
        console.log(markdown_1.default(text));
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