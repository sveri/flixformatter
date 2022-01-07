import * as vscode from 'vscode';
// import {formatCode} from './formatter';

import {parse} from './jsParser';


function getFullTextRange() {
    let textEditor = vscode.window.activeTextEditor;
    if (textEditor === undefined) {
        return new vscode.Range(0, 0, 10, 10);
    }
    const firstLine = textEditor.document.lineAt(0);
    const lastLine = textEditor.document.lineAt(textEditor.document.lineCount - 1);

    return new vscode.Range(
        0,
        firstLine.range.start.character,
        textEditor.document.lineCount - 1,
        lastLine.range.end.character
    );
}

function getEol(document: vscode.TextDocument): string {
    switch (document.eol) {
        case vscode.EndOfLine.CRLF:
            return "\r\n";

        default:
            return "\n";
    }
}



export class FlixDocumentFormatter implements vscode.DocumentFormattingEditProvider {

    public provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
        let tabSize = 4;
        // const newText = formatCode(tabSize, document.getText(), getEol(document));
        const newText = parse(document.getText(), tabSize);
        return [vscode.TextEdit.replace(getFullTextRange(), newText)];
    }
}