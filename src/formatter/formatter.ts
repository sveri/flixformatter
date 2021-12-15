import { strictEqual } from 'assert';
import * as vscode from 'vscode';


enum FileState {
    namespace,
    function,
    if,
    else,
    match,
    case
}

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


function indentLine(tabSize: number, state: FileState[], newLine: string): string {
    if (state.length === 0) {
        return newLine;
    }
    return " ".repeat(tabSize * state.length) + newLine;
}





export class FlixDocumentFormatter implements vscode.DocumentFormattingEditProvider {

    public provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
        let tabSize = 2;
        let newText = "";
        let state: FileState[] = [];

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const trimmedLine = line.text.trim();
            let newLine = trimmedLine;

            if (trimmedLine.startsWith("}")) {
                state.pop();
            }

            newLine = indentLine(tabSize, state, newLine);

            if (trimmedLine.startsWith("namespace")) {
                state.push(FileState.namespace);
            } else if (trimmedLine.startsWith("def")
                || trimmedLine.startsWith("pub def")) {
                state.push(FileState.function);
            } else if (trimmedLine.startsWith("match") && trimmedLine.endsWith("{")) {
                state.push(FileState.match);
            } else if (trimmedLine.startsWith("case") && trimmedLine.endsWith("{")) {
                state.push(FileState.case);
            } else if (trimmedLine.startsWith("if")) {
                state.push(FileState.if);
            } else if (trimmedLine.startsWith("else")) {
                state.push(FileState.else);
            } else if (FileState.if === state[state.length - 1] && !trimmedLine.endsWith(";")) {
                state.pop();
            }else if (FileState.else === state[state.length - 1] && !trimmedLine.endsWith(";")) {
                state.pop();
            } else if (FileState.function === state[state.length - 1] && !trimmedLine.endsWith(";") && !trimmedLine.endsWith("=")) {
                state.pop();
            }

            newText += newLine;

            newText = addEolToLine(document, i, newText);

        }




        return [vscode.TextEdit.replace(getFullTextRange(), newText)];
    }
}