import {getIdentifierName} from './util';
import {parseMethod} from './method.parser';


export function parseInstance(instance: any, tabSize: number, indentationLevel: number): string {
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