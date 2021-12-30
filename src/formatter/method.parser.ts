import { getSpaces } from './util';

function parseArgsWithParenWithType(args: [any]): string {
    let resultString = "";
    for (let i = 0; i < args.length; i++) {
        let arg = args[i];
        resultString += arg.param + ": ";
        resultString += arg.paramType;
        if (i < args.length - 1) {
            resultString += ", ";
        }
    }

    return resultString;
}

function parseArgsWithParen(args: [any]): string {
    let resultString = "";
    for (let i = 0; i < args.length; i++) {
        let arg = args[i];
        resultString += arg.param;
        if (i < args.length - 1) {
            resultString += ", ";
        }
    }

    return resultString;
}


function parseShortMethodBody(body: any): string {
    let resultString = "";

    // console.log("body: " + JSON.stringify(body));

    resultString += body.name;

    resultString += "(" + parseArgsWithParen(body.args.args) + ")";

    return resultString;
}


function parseLongMethodBody(body: [any], tabSize: number, indentationLevel: number): string {
    let resultString = "";

    
    indentationLevel++;
    console.log("body: " + tabSize + " ".repeat(tabSize * indentationLevel) + indentationLevel);

    for (const bodyElement of body as any) {
        if (bodyElement.type === 'javaImport') {
            resultString += getSpaces(tabSize, indentationLevel) + "import " + bodyElement.identifierOne +
                bodyElement.identifier.join("") + "(" + bodyElement.parenIdentifier + ");\n";

        } else if (bodyElement.type === 'methodLine') {
            resultString += getSpaces(tabSize, indentationLevel) + bodyElement.line + "\n";
        }
    }

    
    indentationLevel--;

    return resultString;
}

export function parseMethod(methodBody: any, tabSize: number, indentationLevel: number): string {
    let resultString = "";


    resultString += getSpaces(tabSize, indentationLevel);

    resultString += methodBody.pubdef + " ";

    resultString += methodBody.name + "(";
    if (methodBody.args !== undefined && methodBody.args.type === 'argsWithParenWithType') {
        resultString += parseArgsWithParenWithType(methodBody.args.args);
    }
    resultString += "): ";

    resultString += methodBody.returnType;

    if (methodBody.body !== undefined && methodBody.body[0].type === 'shortMethodBody') {
        resultString += " = " + parseShortMethodBody(methodBody.body[0]) + "\n";
    } else if (methodBody.body !== undefined) {
        resultString += " =\n" + parseLongMethodBody(methodBody.body, tabSize, indentationLevel);
    }

    return resultString;
}