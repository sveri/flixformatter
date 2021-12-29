import {getIdentifierName, withSpaces} from './util';
import {parseMethod} from './method.parser';

function getLawless(clazz: any): string {
    if(clazz.lawless.lawless) {
        return "lawless ";
    }

    return "";
}

export function parseClass(clazz: any, tabSize: number, indentationLevel: number): string {
    let resultString = "";

    console.log("class: " + JSON.stringify(clazz));

    resultString += "pub " + getLawless(clazz) + "class " + clazz.name;

    if(clazz.classTypeInfo !== undefined) {
        resultString += "[" + clazz.classTypeInfo + "]";
    }
    
    resultString += " {\n";
    indentationLevel++;

    for (const bodyElement of clazz.body as any) {
        // let bodyElement = bodyElements[0];

        if (bodyElement.type === 'comment') {
            resultString += withSpaces(bodyElement.text + "\n", tabSize, indentationLevel);
        } else if (bodyElement.type === 'methodDeclaration') {
            resultString += parseMethod(bodyElement, tabSize, indentationLevel) + "\n";
        }
        
    }

    // if(clazz.body !== undefined && clazz.body.type === 'method') {

    //     resultString += parseMethod(clazz.body, tabSize, indentationLevel) + "\n";
    // }

    indentationLevel--;
    resultString += "}";

    return resultString;
}