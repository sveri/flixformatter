/* eslint-disable @typescript-eslint/naming-convention */

import {
    createToken,
    Lexer,
    CstParser,
    EmbeddedActionsParser,
    TokenType,
  } from "chevrotain";

  import * as T from './token';

  export function defineRules(t: any ) {

    t.RULE("singleLineComment", () => {
      const r = t.CONSUME(T.SingleComment);
      return t.getIndentation() + r.image;
    });
    // https://docs.oracle.com/javase/specs/jls/se16/html/jls-3.html#jls-Literal
    // $.RULE("literal", () => {
    //   $.OR([
    //     { ALT: () => $.SUBRULE($.integerLiteral) },
    //     { ALT: () => $.SUBRULE($.floatingPointLiteral) },
    //     { ALT: () => $.SUBRULE($.booleanLiteral) },
    //     { ALT: () => $.CONSUME(t.CharLiteral) },
    //     { ALT: () => $.CONSUME(t.TextBlock) },
    //     { ALT: () => $.CONSUME(t.StringLiteral) },
    //     { ALT: () => $.CONSUME(t.Null) }
    //   ]);
    // });
  
    // // https://docs.oracle.com/javase/specs/jls/se16/html/jls-3.html#jls-IntegerLiteral
    // $.RULE("integerLiteral", () => {
    //   $.OR([
    //     { ALT: () => $.CONSUME(t.DecimalLiteral) },
    //     { ALT: () => $.CONSUME(t.HexLiteral) },
    //     { ALT: () => $.CONSUME(t.OctalLiteral) },
    //     { ALT: () => $.CONSUME(t.BinaryLiteral) }
    //   ]);
    // });
  
    // // https://docs.oracle.com/javase/specs/jls/se16/html/jls-3.html#jls-FloatingPointLiteral
    // $.RULE("floatingPointLiteral", () => {
    //   $.OR([
    //     { ALT: () => $.CONSUME(t.FloatLiteral) },
    //     { ALT: () => $.CONSUME(t.HexFloatLiteral) }
    //   ]);
    // });
  
    // // https://docs.oracle.com/javase/specs/jls/se16/html/jls-3.html#jls-BooleanLiteral
    // $.RULE("booleanLiteral", () => {
    //   $.OR([{ ALT: () => $.CONSUME(t.True) }, { ALT: () => $.CONSUME(t.False) }]);
    // });
  }
  


//   export class FlixMethodParser extends EmbeddedActionsParser {
//   // export class FlixMethodParser extends EmbeddedActionsParser {
//     tabSize = 4;
//     indentationLevel = 0;
  
//     constructor() {
//       super(T.allTokens);
//       this.performSelfAnalysis();
//     }

//     private getIndentation() {
//       return " ".repeat(this.tabSize * this.indentationLevel);
//     }

//     public method = this.RULE("method", () => {
//         const pubDef = this.CONSUME(T.PubDef);
//         const methodName = this.CONSUME(T.Identifier);
    
//         let argumentsWithType: any[] = [];
//         this.CONSUME(T.LParen);
//         this.MANY_SEP({
//           SEP: T.Comma, DEF: () => {
//             argumentsWithType.push(this.SUBRULE(this.argumentsWithType));
//           }
//         });
//         this.CONSUME(T.RParen);
//         let returnType = this.SUBRULE(this.methodReturnType);
//         this.CONSUME(T.Assignment);
//         let methodBody = this.SUBRULE(this.methodBody);
    
//         return this.getIndentation() + pubDef.image + " " + methodName.image + "(" + argumentsWithType.join(", ") + ")"
//           + returnType + " = " + methodBody;
//       });
    
//       private methodReturnType = this.RULE("methodReturnType", () => {
//         this.CONSUME(T.Colon);
//         let type = this.SUBRULE(this.oneOfTheTypes);
//         return ": " + type;
//       });
    
//       private methodBody = this.RULE("methodBody", () => {
//         let result = "";
//         this.MANY({
//           DEF: () => {
//             this.OR([
//               { ALT: () => result += this.SUBRULE(this.referenceMethodCall)},
//             ]);
//           },
//         });
    
//         return result;
//       });
    
//       // $FLOAT32_ADD$(x, y)
//       private referenceMethodCall = this.RULE("referenceMethodCall", () => {
//         let call = this.CONSUME(T.ReferenceMethodCall);
    
//         let argumentsWithoutType: any[] = [];
//         this.CONSUME(T.LParen);
//         this.MANY_SEP({
//           SEP: T.Comma, DEF: () => {
//             argumentsWithoutType.push(this.SUBRULE(this.argumentsWithouthType));
//           }
//         });
//         this.CONSUME(T.RParen);
    
//         return call.image + "(" + argumentsWithoutType.join(", ") + ")";
//       });
    
//       // (x: Float32, y: Float32)
//       private argumentsWithType = this.RULE("argumentsWithType", () => {
//         let param = this.CONSUME(T.Identifier);
//         this.CONSUME(T.Colon);
//         let paramType = this.SUBRULE(this.oneOfTheTypes);
//         return param.image + ": " + paramType;
//       });
    
//       // (x, y)
//       private argumentsWithouthType = this.RULE("argumentsWithouthType", () => {
//         let param = this.CONSUME(T.Identifier);
//         return param.image;
//       });

//       private oneOfTheTypes = this.RULE("oneOfTheTypes", () => {
//         let typeResult = this.OR([
//           { ALT: () => this.CONSUME(T.TypePure)},
//           { ALT: () => this.CONSUME(T.TypeString)},
//           { ALT: () => this.CONSUME(T.TypeFloat32)},
//           { ALT: () => this.CONSUME(T.TypeFloat64)},
//           { ALT: () => this.CONSUME(T.TypeInt8)},
//           { ALT: () => this.CONSUME(T.TypeInt16)},
//           { ALT: () => this.CONSUME(T.TypeInt32)},
//           { ALT: () => this.CONSUME(T.TypeInt64)},
//           { ALT: () => this.CONSUME(T.TypeBigInt)},
//         ]);
//         return typeResult.image;
//       });

// }

// import { getSpaces } from './util';

// function parseArgsWithParenWithType(args: [any]): string {
//     let resultString = "";
//     for (let i = 0; i < args.length; i++) {
//         let arg = args[i];
//         resultString += arg.param + ": ";
//         resultString += arg.paramType;
//         if (i < args.length - 1) {
//             resultString += ", ";
//         }
//     }

//     return resultString;
// }

// function parseArgsWithParen(args: [any]): string {
//     let resultString = "";
//     for (let i = 0; i < args.length; i++) {
//         let arg = args[i];
//         resultString += arg.param;
//         if (i < args.length - 1) {
//             resultString += ", ";
//         }
//     }

//     return resultString;
// }


// function parseShortMethodBody(body: any): string {
//     let resultString = "";

//     // console.log("body: " + JSON.stringify(body));

//     resultString += body.name;

//     resultString += "(" + parseArgsWithParen(body.args.args) + ")";

//     return resultString;
// }


// function parseLongMethodBody(body: [any], tabSize: number, indentationLevel: number): string {
//     let resultString = "";

    
//     indentationLevel++;
//     console.log("body: " + tabSize + " ".repeat(tabSize * indentationLevel) + indentationLevel);

//     for (const bodyElement of body as any) {
//         if (bodyElement.type === 'javaImport') {
//             resultString += getSpaces(tabSize, indentationLevel) + "import " + bodyElement.identifierOne +
//                 bodyElement.identifier.join("") + "(" + bodyElement.parenIdentifier + ");\n";

//         } else if (bodyElement.type === 'methodLine') {
//             resultString += getSpaces(tabSize, indentationLevel) + bodyElement.line + "\n";
//         }
//     }

    
//     indentationLevel--;

//     return resultString;
// }

// export function parseMethod(methodBody: any, tabSize: number, indentationLevel: number): string {
//     let resultString = "";


//     resultString += getSpaces(tabSize, indentationLevel);

//     resultString += methodBody.pubdef + " ";

//     resultString += methodBody.name + "(";
//     if (methodBody.args !== undefined && methodBody.args.type === 'argsWithParenWithType') {
//         resultString += parseArgsWithParenWithType(methodBody.args.args);
//     }
//     resultString += "): ";

//     resultString += methodBody.returnType;

//     if (methodBody.body !== undefined && methodBody.body[0].type === 'shortMethodBody') {
//         resultString += " = " + parseShortMethodBody(methodBody.body[0]) + "\n";
//     } else if (methodBody.body !== undefined) {
//         resultString += " =\n" + parseLongMethodBody(methodBody.body, tabSize, indentationLevel);
//     }

//     return resultString;
// }