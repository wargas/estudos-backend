"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Questao_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Questao"));
class Import extends standalone_1.BaseCommand {
    async run() {
        const Redis = await (await Promise.resolve().then(() => __importStar(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis")))).default;
        const images = require(this.application.tmpPath('images.json'));
        for await (let img of images) {
            const redisImage = await Redis.get(img.url);
            if (redisImage) {
                const questoes = await Database_1.default.from('questoes').where('alternativas', 'like', `%${img.url}%`);
                for await (let questao of questoes) {
                    await Questao_1.default.query()
                        .where('id', questao.id)
                        .update({
                        alternativas: questao.alternativas.replaceAll(img.url, redisImage)
                    });
                    console.log(`update questao: ${questao.id}`);
                }
            }
        }
    }
}
exports.default = Import;
Import.commandName = 'import';
Import.description = '';
Import.settings = {
    loadApp: true,
    stayAlive: true,
};
//# sourceMappingURL=Import.js.map