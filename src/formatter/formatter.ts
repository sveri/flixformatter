import { freemem } from 'os';
import * as vscode from 'vscode';


export enum FileState {
    comment,
    multilinecomment,
    oneliner,
    namespace,
    class,
    instance,
    function,
    if,
    elseif,
    else,
    match,
    case
}

function isFunctionState(state: FileState[]): boolean { return FileState.function === state[state.length - 1]; }

function addEolToLine(numberLines: number, i: number, eol: string, newText: string) {
    if (i !== numberLines - 1) {
        newText += eol;
    }
    return newText;
}


function indentLine(tabSize: number, state: FileState[], newLine: string): string {
    if (newLine.startsWith("*")) {
        newLine = " " + newLine;
    }
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
    let popAt: number[] = [];

    for (let i = 0; i < numberLines; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // if (popAt > 0 && popAt === i) {
        //     state.pop();
        //     popAt = 0;
        // }

        for (let j = popAt.length - 1; j >= 0; j--) {
            let pop = popAt[j];
            if (i === pop) {
                state.pop();
                popAt.splice(i, 1);
            }
        }

        if (trimmedLine === "") {
            newText += trimmedLine;
            newText = addEolToLine(numberLines, i, eol, newText);
            continue;
        }

        if (trimmedLine.startsWith("}")) {
            state.pop();
        }

        let newLine = trimmedLine;

        // if(isFunctionState(state)){

        // }

        newLine = indentLine(tabSize, state, newLine);

        if ((trimmedLine.startsWith("pub def") || trimmedLine.startsWith("def")) && !trimmedLine.endsWith("=")) {
            // do nothing
            // state.push(FileState.oneliner);
        }
        else if (trimmedLine.startsWith("pub lawless class") || trimmedLine.startsWith("pub class") || trimmedLine.startsWith("class")) {
            state.push(FileState.class);
        } else if (trimmedLine.startsWith("pub def") || trimmedLine.startsWith("def")) {
            state.push(FileState.function);
            popAt.push(findLineWhereFunctionEnds(lines, i));
        } else if (trimmedLine.startsWith("namespace")) {
            state.push(FileState.namespace);
        } else if (trimmedLine.startsWith("instance")) {
            state.push(FileState.instance);
        }else if (trimmedLine.startsWith("match")) {
            state.push(FileState.match);
        }



        // if oneliner: if (a < b) c = d
        else if (trimmedLine.startsWith("if") && !trimmedLine.endsWith(")") && !trimmedLine.endsWith("{")) {
            state.push(FileState.if);
            popAt.push(i + 1);
        }
        // if without braces: 
        // if (a < b) 
        //    c = d
        else if (trimmedLine.startsWith("if") && !trimmedLine.endsWith("{")) {
            state.push(FileState.if);
            popAt.push(i + 2);
        }
        // multiline if
        // if (a < b) {
        //    c = d
        // }
        else if (trimmedLine.startsWith("if")) {
            state.push(FileState.if);
        }


        // else if oneliner: else if (a < b) c = d
        else if ((trimmedLine.startsWith("else if") || trimmedLine.startsWith("} else if")) && !trimmedLine.endsWith(")") && !trimmedLine.endsWith("{")) {
            state.push(FileState.elseif);
            popAt.push(i + 1);
        }
        // else if without braces: 
        // else if (a < b) 
        //    c = d
        else if ((trimmedLine.startsWith("else if") || trimmedLine.startsWith("} else if")) && !trimmedLine.endsWith("{")) {
            state.push(FileState.elseif);
            popAt.push(i + 2);
        }
        // multilin else if
        // if (a < b) {
        //    c = d
        // }
        else if (trimmedLine.startsWith("else if") || trimmedLine.startsWith("} else if")) {
            state.push(FileState.elseif);
        }


        // else without braces: 
        // else  
        //    c = d
        else if (trimmedLine === "else" || trimmedLine === "} else") {
            state.push(FileState.else);
            popAt.push(i + 2);
        }
        // else oneliner: else c = d
        else if ((trimmedLine.startsWith("else") || trimmedLine.startsWith("} else")) && !trimmedLine.endsWith("{")) {
        }
        // multiline else
        // else {
        //    c = d
        // }
        else if ((trimmedLine.startsWith("else") || trimmedLine.startsWith("} else")) && trimmedLine.endsWith("{")) {
            state.push(FileState.else);
        }

        newText += newLine;

        newText = addEolToLine(numberLines, i, eol, newText);

    }

    return newText;
}

function findLineWhereFunctionEnds(lines: string[], currentLineIndex: number): number {
    let uncountedLines = 0;
    let unmatchedBrackets = 0;
    for (let i = currentLineIndex + 1; i < lines.length; i++) {
        let trimmedLine = lines[i].trim();
        if (trimmedLine.startsWith("//") || trimmedLine.startsWith("/*") || trimmedLine.startsWith("*") || trimmedLine === "") {
            uncountedLines++;
            continue;
        }

        if (trimmedLine.indexOf("{") > -1) {
            unmatchedBrackets++;
        }

        if (unmatchedBrackets > 0 && trimmedLine.indexOf("}") > -1) {
            unmatchedBrackets--;
        }

        if (trimmedLine.startsWith("pub") || trimmedLine.startsWith("def") || trimmedLine.startsWith("@")
            || (unmatchedBrackets === 0 && trimmedLine.startsWith("}"))) {
            return i - uncountedLines;
        }
    }

    return lines.length;
}

// function ends when we are 
// - in a function state
// - line does not end with ;
// - line does not end with =
// - multiple lines follow and none ends with ;
// - or file ends
// def foo = a + b
// def foo = 
//   a + b
// def foo = 
//   a 
//   + b
// def foo = 
//   a + b ;
//   0
export function functionEnds(state: FileState[], trimmedLine: string, lines: string[], numberLines: number, lineIndex: number): boolean {
    // if ((FileState.function === state[state.length - 1] && !trimmedLine.endsWith(";") && !trimmedLine.endsWith("="))
    //     || (FileState.function === state[state.length - 1] && checkIfLastStatementInFunction(lines, numberLines, lineIndex) && !trimmedLine.endsWith("="))
    // ) 
    if ((FileState.function === state[state.length - 1] && !trimmedLine.endsWith(";") && !trimmedLine.endsWith("="))
        && checkIfLastStatementInFunction(lines, numberLines, lineIndex)
    ) {
        return true;
    }
    return false;
}

function checkIfLastStatementInFunction(lines: string[], numberLines: number, lineIndex: number): boolean {
    for (let i = lineIndex; i < numberLines; i++) {
        const line = lines[i];
        if (line === undefined) {
            console.log("undefined");
            return true;
        }

        if (line.indexOf(";") > -1) {
            console.log("found ; " + lineIndex);
            return false;
        }

        // if (line.indexOf("pub") > -1) {
        //     console.log("found pub");
        //     return true;
        // }
    }

    console.log("after for " + lineIndex);
    return true;
}






        // if (FileState.oneliner === state[state.length - 1]) {
        //     state.pop();
        // }

        // if (trimmedLine.startsWith("}")) {
        //     state.pop();
        // }

        // if (isFunctionState(state) && trimmedLine.startsWith("pub")) {
        //     state.pop();
        // }



        // if (trimmedLine.startsWith("namespace")) {
        //     state.push(FileState.namespace);
        // } else if (trimmedLine.startsWith("class")
        //     || trimmedLine.startsWith("lawless class")
        //     || trimmedLine.startsWith("pub lawless class")) {
        //     state.push(FileState.class);
        // } else if (trimmedLine.startsWith("instance")) {
        //     state.push(FileState.instance);
        // }
        // else if (trimmedLine.startsWith("pub") && !trimmedLine.endsWith("=")) {
        //     state.push(FileState.oneliner);
        // }
        // else if (trimmedLine.startsWith("def")
        //     || trimmedLine.startsWith("pub def")) {
        //     state.push(FileState.function);
        // } else if (trimmedLine.startsWith("match") && trimmedLine.endsWith("{")) {
        //     state.push(FileState.match);
        // } else if (trimmedLine.startsWith("case") && trimmedLine.endsWith("{")) {
        //     state.push(FileState.case);
        // } else if (trimmedLine.startsWith("if")) {
        //     state.push(FileState.if);
        // } else if (trimmedLine.startsWith("else")) {
        //     state.push(FileState.else);
        // }


        // else if (FileState.if === state[state.length - 1] && !trimmedLine.endsWith(";")) {
        //     state.pop();
        // } else if (FileState.else === state[state.length - 1] && !trimmedLine.endsWith(";")) {
        //     state.pop();
        // }

        // // else if (FileState.function === state[state.length - 1] && !trimmedLine.endsWith(";") && !trimmedLine.endsWith("=")) {
        // else if (functionEnds(state, trimmedLine, lines, numberLines, i)) {
        //     state.pop();
        // }