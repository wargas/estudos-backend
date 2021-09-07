"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthController {
    async login({ request, auth }) {
        const { email, password } = request.all();
        try {
            return await auth.use('api').attempt(email, password);
        }
        catch (error) {
            return { error: 'INVALID_CREDENTIALS' };
        }
    }
    async currentUser({ auth }) {
        return auth.user;
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map