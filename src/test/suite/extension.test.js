"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require("vscode");
// import * as myExtension from '../../extension';
// const testResourcDir = '.vscode-test/stable/Visual Studio Code.app/Contents/Resources/app';
// export const getTestRoot = (): string => {
// 	return vscode.env.appRoot.replace(testResourcDir, '');
//   };
// export const pathTo = (relativeFile: string): string => {
// 	return `./${relativeFile}`;
//   };
suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');
    // const addFile = pathTo('src/test/resources/flixapi/Add.flix');
    test('Sample test', async () => {
        // const document = await vscode.workspace.openTextDocument(addFile);
        // console.log(document);
        // // return vscode.workspace.openTextDocument(FILE_WITH_CELLS).then(document => {
        // 	//             textDocument = document;
        // 	//             return vscode.window.showTextDocument(textDocument);
        // 	//         }).then(editor => {
        // 	//             assert(vscode.window.activeTextEditor, 'No active editor');
        // 	//             editor.selection = new vscode.Selection(2, 0, 2, 0);
        // 	//             return codeHelper.getSelectedCode().then(code => {
        // 	//                 assert.equal(code, textDocument.lineAt(2).text, 'Text is not the same');
        // 	//             });
        // 	//         }).then(done, done);
        assert.strictEqual(-1, [1, 2, 3].indexOf(5));
        assert.strictEqual(-1, [1, 2, 3].indexOf(0));
    });
});
//# sourceMappingURL=extension.test.js.map