"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
class SocketProvider {
    constructor(app) {
        this.app = app;
        this.time = "1 * * * * *";
        this.task = node_cron_1.default.schedule(this.time, () => {
            this.action();
        });
    }
    async action() {
    }
    register() {
    }
    async boot() {
        const HttpContext = this.app.container.use('Adonis/Core/HttpContext');
        this.task.start();
        HttpContext.getter('socket', () => {
            return { task: this.task };
        }, true);
    }
    async ready() {
    }
    async shutdown() {
    }
}
exports.default = SocketProvider;
//# sourceMappingURL=SocketProvider.js.map