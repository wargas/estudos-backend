"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthMiddleware {
    async handle(ctx, next) {
        const authorization = ctx.request.header('Authorization');
        const token = authorization?.split(' ')[1];
        if (!token) {
            ctx.response.status(401).json({ error: 'UNAUTHORIZED' });
            return;
        }
        const payload = jsonwebtoken_1.verify(token, Env_1.default.get('APP_KEY'));
        if (!payload['id']) {
            ctx.response.status(401).json({ error: 'UNAUTHORIZED' });
            return;
        }
        ctx.user = new User_1.default();
        ctx.user.id = payload['id'];
        await next();
    }
}
exports.default = AuthMiddleware;
//# sourceMappingURL=Auth.js.map