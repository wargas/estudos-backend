"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const markdown_it_1 = __importDefault(require("markdown-it"));
const markdown_it_sub_1 = __importDefault(require("markdown-it-sub"));
const markdown_it_sup_1 = __importDefault(require("markdown-it-sup"));
const markdown_it_latex_1 = __importDefault(require("markdown-it-latex"));
function markdownToHtml(markdown) {
    const md = markdown_it_1.default({
        html: true
    })
        .use(markdown_it_sub_1.default)
        .use(markdown_it_sup_1.default)
        .use(markdown_it_latex_1.default);
    return md.render(markdown);
}
exports.default = markdownToHtml;
//# sourceMappingURL=markdown.js.map