import { unwatchFile } from 'fs';
import * as nearley from 'nearley';
import { resourceUsage } from 'process';
import { stringify } from 'querystring';
import { default as myGrammar } from '../grammar';

function getIdentifierName(identifier: {type: string, text: string}): string {
    if(identifier.type !== 'identifier') {
        throw new Error('identifier needs to be of type identifier');
    }
    return identifier.text;
}

function getSpaces(tabSize: number, indentationLevel: number): string {
    return " ".repeat(tabSize * indentationLevel);
}


function parseArgsWithParenWithType(args: [any]): string {
    let resultString = "";
    for(let i = 0; i < args.length; i++){
        let arg = args[i];
        resultString += arg.param.text + ": ";
        resultString += arg.paramType.text;
        if(i < args.length - 1) {
            resultString += ", ";
        }
    }

    return resultString;
}

function parseArgsWithParen(args: [any]): string {
    let resultString = "";
    for(let i = 0; i < args.length; i++){
        let arg = args[i];
        resultString += arg.param.text;
        if(i < args.length - 1) {
            resultString += ", ";
        }
    }

    return resultString;
}


function parseShortMethodBody(body: any): string {
    let resultString = "";

    console.log("body: " + JSON.stringify(body));

    resultString += body.name.text;

    resultString += "(" + parseArgsWithParen(body.args.args) + ")";

    return resultString;
}

function parseMethod(methodBody: any, tabSize: number, indentationLevel: number): string {
    let resultString = "";

    console.log("methodBody: " + JSON.stringify(methodBody));

    resultString += getSpaces(tabSize, indentationLevel);
    
    resultString += methodBody.pubdef.text + " ";
    
    resultString += methodBody.name.text + "(";
    if(methodBody.args !== undefined && methodBody.args.type === 'argsWithParenWithType') {
        resultString += parseArgsWithParenWithType(methodBody.args.args);
    }
    resultString += "): ";

    resultString += methodBody.returnType.text + " = ";

    if(methodBody.body !== undefined && methodBody.body.type === 'shortMethodBody') {
        resultString += parseShortMethodBody(methodBody.body);
    }

    return resultString;
}

function parseInstance(instance: any, tabSize: number, indentationLevel: number): string {
    let resultString = "";

    // console.log("instance: " + JSON.stringify(instance));

    resultString += "instance " + getIdentifierName(instance.name);

    if(instance.instanceTypeInfo !== undefined) {
        resultString += "[" + instance.instanceTypeInfo.text + "]";
    }
    
    resultString += " {\n";
    indentationLevel++;

    if(instance.body !== undefined && instance.body.type === 'method') {

        resultString += parseMethod(instance.body, tabSize, indentationLevel) + "\n";
    }

    indentationLevel--;
    resultString += "}";

    return resultString;
}

function parseResult(results: any, tabSize: number): string {
    let resultString = "";
    let indentationLevel = 0;

    if (results.type === 'main') {
        // console.log("main_element: " + JSON.stringify(results));

        for (const resultBodyArray of results.body as any) {
            // console.log("results_array: " + JSON.stringify(resultBodyArray));
            for (const body of resultBodyArray as any) {
                if (body.type === 'comment') {
                    resultString += body.text + "\n";
                } else if (Array.isArray(body)) {
                    for (const bodyArray of body as any) {
                        if (bodyArray.type === 'instance') {
                            resultString += parseInstance(bodyArray, tabSize, indentationLevel);
                        }
                    }
                }
            }
        }
    }

    return resultString;
}

export function recursionTest(results: any, resultString: string): string {
    if (results === undefined || results.length === 0) {
        return resultString;
    }


    return recursionTest(results.slice(1), resultString += results[0]);
}


export function parse(s: string, tabSize: number) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(myGrammar));
    let parsedText = parser.feed(s).results;

    // console.log(JSON.stringify(parsedText));

    return parseResult(parsedText[0], tabSize);
}
