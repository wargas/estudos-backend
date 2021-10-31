"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthController {
    async login({ request }) {
        const { email, password } = request.all();
        const user = await User_1.default.findBy('email', email);
        if (!user) {
            return { error: 'INVALID_CREDENTIALS' };
        }
        if (!await Hash_1.default.verify(user.password, password)) {
            return { error: 'INVALID_CREDENTIALS' };
        }
        try {
            const token = await jsonwebtoken_1.sign({ id: user.id }, Env_1.default.get('APP_KEY'));
            return { token };
        }
        catch (error) {
            return { error: 'INTERNAL ERROR' };
        }
    }
    async currentUser({ user }) {
        const user_id = user.id;
        return await User_1.default.find(user_id);
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map