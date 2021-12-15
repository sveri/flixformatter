import * as vscode from 'vscode';


enum FileState {
    namespace,
    function,
    if,
    else,
    match,
    case
}

function addEolToLine(numberLines: number, i: number, eol: string, newText: string) {
    if (i !== numberLines - 1) {
        newText += eol;
    }
    return newText;
}


function indentLine(tabSize: number, state: FileState[], newLine: string): string {
    if (state.length === 0) {
        return newLine;
    }
    return " ".repeat(tabSize * state.length) + newLine;
}


export function formatCode(tabSize: number, text: string, eol: string): string {
    let newText = "";
    let state: FileState[] = [];
    let lines = text.split(eol);
    let numberLines = lines.length;

    for (let i = 0; i < numberLines; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
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

        newText = addEolToLine(numberLines, i, eol, newText);

    }

    return newText;
}