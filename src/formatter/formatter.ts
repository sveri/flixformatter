import { strictEqual } from 'assert';
import * as vscode from 'vscode';

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
            break;

        default:
            return "\n";
            break;
    }
}

function addEolToLine(document: vscode.TextDocument, i: number, newText: string) {
    if (i !== document.lineCount - 1) {
        newText += getEol(document);
    }
    return newText;
}



function indentLine(tabSize: number, indentationLevel: number, newLine: string): string {
    if (indentationLevel === 0) {
        return newLine;
    }
    return " ".repeat(tabSize * indentationLevel) + newLine;
}


export class FlixDocumentFormatter implements vscode.DocumentFormattingEditProvider {
    public provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
        let tabSize = 4;
        let indentationLevel = 0;
        let newText = "";

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            let newLine = line.text.trim();

            newLine = indentLine(tabSize, indentationLevel, newLine);

            if (line.text.trim().startsWith("namespace")
                || line.text.trim().startsWith("pub")
                || line.text.trim().startsWith("def")
                || line.text.trim().startsWith("match")) {
                indentationLevel++;
            }

            newText += newLine;

            newText = addEolToLine(document, i, newText);

        }




        return [vscode.TextEdit.replace(getFullTextRange(), newText)];
    }
    // public provideDocumentFormattingEdits(document: vscode.TextDocument):
    //     Thenable<vscode.TextEdit[]> {
    //     let tabSize = 4;
    //     let insertSpaces = true;

    //     const editor = vscode.window.activeTextEditor;
    //     if (editor) {
    //         tabSize = editor.options.tabSize as number;
    //         insertSpaces = editor.options.insertSpaces as boolean;
    //     }
    //     const indent = insertSpaces ? ' '.repeat(tabSize) : '\t';

    //     const lang = document.languageId, uri = document.uri;
    //     const langConfig = vscode.workspace.getConfiguration(`[${lang}]`, uri);
    //     const config = vscode.workspace.getConfiguration('editor', uri);
    //     const width =
    //         langConfig['editor.wordWrapColumn'] ||
    //         config.get('wordWrapColumn', 80);

    //     const text = document.getText();
    //     const range = new vscode.Range(
    //         document.positionAt(0),
    //         document.positionAt(text.length)
    //     );
    //     console.log(text);
    //     return Promise.resolve([
    //         new vscode.TextEdit(range, text)
    //         // new vscode.TextEdit(range, format(text, indent, width))
    //     ]);
    // }
}