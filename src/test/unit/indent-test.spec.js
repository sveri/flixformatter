"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const fs = require("fs");
const formatter_1 = require("../../src/formatter/formatter");
function getLineBreakChar(s) {
    const indexOfLF = s.indexOf('\n', 1); // No need to check first-character
    if (indexOfLF === -1) {
        if (s.indexOf('\r') !== -1) {
            return '\r';
        }
        return '\n';
    }
    if (s[indexOfLF - 1] === '\r') {
        return '\r\n';
    }
    return '\n';
}
// let flixFolderFiles = await fs.promises.readdir('./src/test/resources/flixapi/', { withFileTypes: true });
let flixFolderFiles = fs.readdirSync('./test/resources/flixapi/', { withFileTypes: true });
flixFolderFiles.filter(f => f.isFile()).forEach(f => {
    describe('Indentation should remain the same for: ' + f.name, async () => {
        it(`api file`, async () => {
            let fileContent = fs.readFileSync(`./test/resources/flixapi/${f.name}`).toString();
            (0, chai_1.expect)((0, formatter_1.formatCode)(4, fileContent, getLineBreakChar(fileContent))).to.equal(fileContent);
        });
    });
});
//# sourceMappingURL=indent-test.spec.js.map