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