import { unwatchFile } from 'fs';
import * as nearley from 'nearley';
import { resourceUsage } from 'process';
import { stringify } from 'querystring';
import { default as myGrammar } from '../grammar';


// function parseResult(results: any, resultString: string, indentationLevel: number): string {
//     if(results.length === 0) {
//         return resultString;
//     } 
//     console.log("parseResult: " + JSON.stringify(results));

//     // let result = results;
//     if(Array.isArray(results)) {

//         for (const result of results as any) {
//             if(Array.isArray(result)) {
//                 return parseResult(result[0], resultString, indentationLevel);
//             }

//             if(result.type === 'element') {
//                 console.log("array element: " + JSON.stringify(result));
//                 for (const element of result.data as any) {
//                     return parseResult(element, resultString, 0);    
//                 }
//             }

//             else if(result.type === 'comment') {
//                 console.log("array comment: " + JSON.stringify(result));
//                 if(Array.isArray(result)) {
//                     return parseResult(result[0], resultString, indentationLevel);
//                 }
//                 return resultString += result.data.text;    
//             }
//         }

//     } else {
//         if(results.type === 'element') {
//             console.log("object element: " + JSON.stringify(results));
//             for (const element of results.data as any) {
//                 return parseResult(element, resultString, 0);    
//             }
//         }

//         else if(results.type === 'comment') {
//             console.log("object comment: " + JSON.stringify(results));
//             if(Array.isArray(results.data)) {
//                 parseResult(results.data[0], resultString, indentationLevel);
//             }
//             return resultString += results.text;    
//         }

//     }



//     return resultString;
// }

// function parseResult(results: any, resultString: string, indentationLevel: number): string | undefined {
//     if (results === undefined) {
//         return resultString;
//     }
//     if (Array.isArray(results)) {
//         for (const result of results as any) {
//             console.log("results_array: " + JSON.stringify(result));
//             return parseResult(result, resultString, indentationLevel);
//         }
//     } 
//     // else if (Array.isArray(results.data)) {
//     //     console.log("result_array: " + JSON.stringify(results));
//     //     return parseResult(results.data, resultString, indentationLevel);
//     // } 
//     else if (results.type === 'main') {
//         console.log("main_element: " + JSON.stringify(results));
//         return parseResult(results.body, resultString, indentationLevel);
//     } else if (results.type === 'comment') {
//         console.log("comment: " + JSON.stringify(results));
//         return resultString += results.text + "\n";
//     }

//     // return resultString;
// }

function getIdentifierName(identifier: {type: string, text: string}): string {
    if(identifier.type !== 'identifier') {
        throw new Error('identifier needs to be of type identifier');
    }
    return identifier.text;
}

function parseInstance(instance: any): string {
    let resultString = "";

    console.log("instance: " + JSON.stringify(instance));

    resultString += "instance " + getIdentifierName(instance.name) + "{\n";



    return resultString + "}\\n";

}

function parseResult(results: any): string {
    let resultString = "";

    if (results.type === 'main') {
        console.log("main_element: " + JSON.stringify(results));

        for (const resultBodyArray of results.body as any) {
            console.log("results_array: " + JSON.stringify(resultBodyArray));
            for (const body of resultBodyArray as any) {
                if (body.type === 'comment') {
                    resultString += body.text + "\n";
                } else if (Array.isArray(body)) {
                    for (const bodyArray of body as any) {
                        if (bodyArray.type === 'instance') {
                            resultString += parseInstance(bodyArray);
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


export function parse(s: string) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(myGrammar));
    let parsedText = parser.feed(s).results;


    let resultTxt = "";
    console.log(JSON.stringify(parsedText));

    return parseResult(parsedText[0]);
    // return parseResult(parsedText[0], resultTxt, 0);


    // for (const element of parsedText as any) {
    //     if (!Array.isArray(element)) {

    //         if(element.type === "file"){
    //             // console.log(element.data[0]);
    //             continue;
    //         }

    //         // if (element.value === '<') {
    //         //     resultTxt += " ";
    //         // }

    //         // resultTxt += element.value;

    //         // if (element.value === 'if'
    //         //     || element.value === '<') {
    //         //     resultTxt += " ";
    //         // }
    //     }
    // };

    // parser.finish

    // return resultTxt;
}
