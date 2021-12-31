import * as nearley from 'nearley';
import { default as myGrammar } from '../grammar';
import { parseInstance } from './instance.parser';
import { parseClass } from './class.parser';







function parseResult(results: any, tabSize: number): string {
    let resultString = "";
    let indentationLevel = 0;

    console.log("parseResult: " + JSON.stringify(results));
    if (results.type === 'main') {

        // for (const resultBodyArray of results.body as any) {
        // console.log("results_array: " + JSON.stringify(resultBodyArray));
        for (const bodyArray of results.body as any) {
            // if (Array.isArray(body)) {
                // for (const bodyArray of body as any) {
                    if (bodyArray.type === 'comment') {
                        resultString += bodyArray.text + "\n";
                    } else if ( bodyArray.type === 'multiLineComment') {
                        resultString += "/*" + bodyArray.text + "*/\n";
                    } else if (bodyArray.type === 'instance') {
                        resultString += parseInstance(bodyArray, tabSize, indentationLevel) + "\n\n";
                    } else if (bodyArray.type === 'class') {
                        resultString += parseClass(bodyArray, tabSize, indentationLevel) + "\n\n";
                    }
                // }
            // }
        }
        // }
    }

    return resultString.trim();
}


export function parse(s: string, tabSize: number) {
    // console.log("toParse: " + JSON.stringify(s));
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(myGrammar));
    let parsedText = parser.feed(s).results;
    
    // console.log("parsedText " + JSON.stringify(parsedText));

    return parseResult(parsedText[0], tabSize);
}
