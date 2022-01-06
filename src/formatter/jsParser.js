/* eslint-disable @typescript-eslint/naming-convention */
"use strict";

// const { EmbeddedActionsParser, isRecognitionException } = require("chevrotain");
import * as T from './token.js';

import {
    createToken,
    Lexer,
    CstParser,
    EmbeddedActionsParser,
} from "chevrotain";


// export const SingleComment = createToken({
//     name: "SingleComment",
//     pattern: /\/\/[^\n\r]*?(?:\*\)|[\r\n|\n])/,
//   });

//   let tokens = [
//     SingleComment
//   ];


// const method = require("./method.parser.js");
import * as C from "./class.parser.js";
import * as I from "./instance.parser.js";
import * as M from "./method.parser.js";

  

const flixLexer = new Lexer(T.allTokens);

// Embedded Actions
class FlixParser extends EmbeddedActionsParser {
    tabSize = 4;
    indentationLevel;

    constructor() {
        super(T.allTokens);
        //     , {
        //     maxLookahead: 1,
        //     nodeLocationTracking: "full",
        //     // traceInitPerf: 2,
        //     // skipValidations: getSkipValidations()
        // });
        this.indentationLevel = 0;

        // defineRules.call(this, this);

        M.defineMethod.call(this, this);
        I.defineInstance.call(this, this);
        C.defineClass.call(this, this);

        this.performSelfAnalysis();
    }

    getIndentation() {
        return " ".repeat(this.tabSize * this.indentationLevel);
    }

    flix = this.RULE("file", () => {
        let result = "";
        this.MANY({
            DEF: () => {
                this.OR([
                    { ALT: () => result += this.SUBRULE(this.singleLineComment) },
                    { ALT: () => result += this.SUBRULE(this.multiLineComment) },
                    { ALT: () => result += this.SUBRULE(this.instance) },
                    { ALT: () => result += this.SUBRULE(this.clazz) },
                    // { ALT: () => result += this.SUBRULE(this.javaImport)},
                ]);
            },
        });

        return result;
    });

    singleLineComment = this.RULE("singleLineComment", () => {
        const r = this.CONSUME(T.SingleComment);
        return this.getIndentation() + r.image;
    });

    multiLineComment = this.RULE("multiLineComment", () => {
        const r = this.CONSUME(T.MultiLineComment);
        return r.image;
    });

    // clazz = this.RULE("clazz", () => {
    //     let className = this.SUBRULE(this.clazzNameWithModifier);
    //     this.CONSUME(T.LCurly);
    //     this.indentationLevel++;
    //     let classBody = this.SUBRULE(this.instanceOrClassBody);
    //     this.indentationLevel--;
    //     this.CONSUME(T.RCurly);
    //     return className + "{\n" + classBody + "}\n\n";
    // });

    // // pub lawless class Foo | lawless class Foo | pub class Foo | class Foo
    // clazzNameWithModifier = this.RULE("clazzNameWithModifier", () => {
    //     let pub = "", lawless = "", name = "";
    //     this.OR([
    //         {
    //             ALT: () => {
    //                 pub = this.CONSUME(T.Pub).image;
    //                 lawless = this.CONSUME(T.Lawless).image;
    //                 this.CONSUME(T.Class);
    //                 name = this.CONSUME(T.Identifier).image;
    //             }
    //         },
    //         {
    //             ALT: () => {
    //                 lawless = this.CONSUME1(T.Lawless).image;
    //                 this.CONSUME1(T.Class);
    //                 name = this.CONSUME1(T.Identifier).image;
    //             }
    //         },
    //         {
    //             ALT: () => {
    //                 this.CONSUME2(T.Class);
    //                 name = this.CONSUME2(T.Identifier).image;
    //             }
    //         },
    //         {
    //             ALT: () => {
    //                 pub = this.CONSUME1(T.Pub).image;
    //                 this.CONSUME3(T.Class);
    //                 name = this.CONSUME3(T.Identifier).image;
    //             }
    //         }
    //     ]);
    //     let type = this.SUBRULE(this.singleBracketWithType);
    //     return pub + " " + lawless + " class " + name + type + " ";;
    // });

    // instance = this.RULE("instance", () => {
    //     this.CONSUME(T.Instance);
    //     let identifier = this.CONSUME(T.Identifier);
    //     let instanceType = this.SUBRULE(this.singleBracketWithType);
    //     this.CONSUME(T.LCurly);
    //     this.indentationLevel++;
    //     let instanceBody = this.SUBRULE(this.instanceOrClassBody);
    //     this.indentationLevel--;
    //     this.CONSUME(T.RCurly);
    //     return "instance " + identifier.image + instanceType + " {\n" + instanceBody + "}\n\n";
    // });

    // instanceOrClassBody = this.RULE("instanceOrClassBody", () => {
    //     let result = "";

    //     this.MANY({
    //         DEF: () => {
    //             this.OR([
    //                 { ALT: () => result += this.SUBRULE(this.method) },
    //                 { ALT: () => result += this.SUBRULE(this.singleLineComment) },
    //                 { ALT: () => result += this.SUBRULE(this.multiLineComment) },
    //             ]);
    //         },
    //     });
    //     return result;
    // });

    // public method = this.RULE("method", () => {
    //     const pubDef = this.CONSUME(T.PubDef);
    //     const methodName = this.CONSUME(T.Identifier);

    //     let argumentsWithType: any[] = [];
    //     this.CONSUME(T.LParen);
    //     this.MANY_SEP({
    //         SEP: T.Comma, DEF: () => {
    //             argumentsWithType.push(this.SUBRULE(this.argumentsWithType));
    //         }
    //     });
    //     this.CONSUME(T.RParen);
    //     let returnType = this.SUBRULE(this.methodReturnType);
    //     // this.CONSUME(T.Assignment);
    //     // let methodBody = this.SUBRULE(this.methodBody);
    //     let assignment;
    //     let methodBody = "";
    //     this.OPTION(() => { assignment = this.CONSUME(T.Assignment); });
    //     this.OPTION1(() => { methodBody = this.methodBody(); });

    //     if (assignment === undefined) {
    //         assignment = "";
    //     } else {
    //         assignment = " =";
    //     }

    //     return this.getIndentation() + pubDef.image + " " + methodName.image + "(" + argumentsWithType.join(", ") + ")"
    //         + returnType + assignment + "\n" + methodBody;
    // });

    // methodReturnType = this.RULE("methodReturnType", () => {
    //     this.CONSUME(T.Colon);
    //     let type = this.SUBRULE(this.oneOfTheTypes);
    //     return ": " + type;
    // });

    // methodBody = this.RULE("methodBody", () => {
    //     let result = "";
    //     this.indentationLevel++;
    //     this.MANY({
    //         DEF: () => {
    //             this.OR([
    //                 { ALT: () => result += this.SUBRULE(this.referenceMethodCall) },
    //                 { ALT: () => result += this.SUBRULE(this.javaImport) },
    //                 { ALT: () => result += this.SUBRULE(this.completeJavaMethodCallWithType) },
    //             ]);
    //         },
    //     });
    //     this.indentationLevel--;

    //     return result;
    // });

    // // (x \`concat\` y) as & Pure
    // completeJavaMethodCallWithType = this.RULE("completeJavaMethodCallWithType", () => {
    //     this.CONSUME(T.LParen);
    //     let lhs = this.SUBRULE(this.lhsOfJavaMethodCall);
    //     let method = this.CONSUME(T.JavaMethodCall);
    //     let rhs = this.SUBRULE(this.rhsOfJavaMethodCall);
    //     this.CONSUME(T.RParen);

    //     this.CONSUME(T.As);

    //     this.CONSUME(T.Ampersand);

    //     let type = this.SUBRULE(this.oneOfTheTypes);

    //     // return call.image + "(" + callIdentifier.join(", ") + ")";
    //     return this.getIndentation() + "(" + lhs + " " + method.image + " " +
    //         rhs + ") as & " + type + "\n";
    // });

    // lhsOfJavaMethodCall = this.RULE("lhsOfJavaMethodCall", () => {
    //     let imports = this.CONSUME(T.Identifier);
    //     return imports.image;
    // });

    // rhsOfJavaMethodCall = this.RULE("rhsOfJavaMethodCall", () => {
    //     let imports = this.CONSUME(T.Identifier);
    //     return imports.image;
    // });

    // javaImport = this.RULE("javaImport", () => {
    //     let imports = this.CONSUME(T.JavaImport);

    //     return this.getIndentation() + imports.image + "\n";
    // });

    // // $FLOAT32_ADD$(x, y)
    // referenceMethodCall = this.RULE("referenceMethodCall", () => {
    //     let call = this.CONSUME(T.ReferenceMethodCall);

    //     let argumentsWithoutType: any[] = [];
    //     this.CONSUME(T.LParen);
    //     this.MANY_SEP({
    //         SEP: T.Comma, DEF: () => {
    //             argumentsWithoutType.push(this.SUBRULE(this.argumentsWithouthType));
    //         }
    //     });
    //     this.CONSUME(T.RParen);

    //     return this.getIndentation() + call.image + "(" + argumentsWithoutType.join(", ") + ")\n";
    // });

    // // (x: Float32, y: Float32)
    // argumentsWithType = this.RULE("argumentsWithType", () => {
    //     let param = this.CONSUME(T.Identifier);
    //     this.CONSUME(T.Colon);
    //     let paramType = this.SUBRULE(this.oneOfTheTypes);
    //     return param.image + ": " + paramType;
    // });

    // // (x, y)
    // argumentsWithouthType = this.RULE("argumentsWithouthType", () => {
    //     let param = this.CONSUME(T.Identifier);
    //     return param.image;
    // });

    // //[String]
    // singleBracketWithType = this.RULE("singleBracketType", () => {
    //     this.CONSUME(T.LSquare);
    //     let instanceType = this.SUBRULE(this.oneOfTheTypes);
    //     this.CONSUME(T.RSquare);
    //     return "[" + instanceType + "]";
    // });

    // oneOfTheTypes = this.RULE("oneOfTheTypes", () => {
    //     let typeResult = this.OR([
    //         { ALT: () => this.CONSUME(T.TypePure) },
    //         { ALT: () => this.CONSUME(T.TypeString) },
    //         { ALT: () => this.CONSUME(T.TypeFloat32) },
    //         { ALT: () => this.CONSUME(T.TypeFloat64) },
    //         { ALT: () => this.CONSUME(T.TypeInt8) },
    //         { ALT: () => this.CONSUME(T.TypeInt16) },
    //         { ALT: () => this.CONSUME(T.TypeInt32) },
    //         { ALT: () => this.CONSUME(T.TypeInt64) },
    //         { ALT: () => this.CONSUME(T.TypeBigInt) },
    //         { ALT: () => this.CONSUME(T.Identifier) },
    //     ]);
    //     return typeResult.image;
    // });
}


function parse(s, tabSize) {
    const parser = new FlixParser();

    const lexResult = flixLexer.tokenize(s);

    if (lexResult.errors !== undefined && lexResult.errors.length > 0) {
        console.log("lexer errors: " + JSON.stringify(lexResult.errors));
    }

    parser.input = lexResult.tokens;
    if (parser.errors !== undefined && parser.errors.length > 0) {
        console.log("parser errors: " + JSON.stringify(parser.errors));
    }

    let parsedResult = parser.flix().trim();
    console.log("parsedResult: " + JSON.stringify(parsedResult));

    return parsedResult;
}

export { parse };

// module.exports = {
//     parse
//   };