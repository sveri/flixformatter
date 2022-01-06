/* eslint-disable @typescript-eslint/naming-convention */
"use strict";


import * as T from './token.js';

export function defineClass($, t) {
    // https://docs.oracle.com/javase/specs/jls/se16/html/jls-3.html#jls-Literal
    // $.RULE("singleLineComment", () => {
    //     const r = $.CONSUME(T.SingleComment);
    //     return $.getIndentation() + r.image;
    // });

    $.RULE("clazz", () => {
        let className = $.SUBRULE($.clazzNameWithModifier);
        $.CONSUME(T.LCurly);
        $.indentationLevel++;
        let classBody = $.SUBRULE($.classBody);
        $.indentationLevel--;
        $.CONSUME(T.RCurly);
        return className + "{\n" + classBody + "}\n\n";
    });

    $.RULE("classBody", () => {
        let result = "";

        $.MANY({
            DEF: () => {
                $.OR([
                    { ALT: () => result += $.SUBRULE($.method) },
                    { ALT: () => result += $.SUBRULE($.singleLineComment) },
                    { ALT: () => result += $.SUBRULE($.multiLineComment) },
                ]);
            },
        });
        return result;
    });

    // pub lawless class Foo | lawless class Foo | pub class Foo | class Foo
    $.RULE("clazzNameWithModifier", () => {
        let pub = "", lawless = "", name = "";
        $.OR([
            {
                ALT: () => {
                    pub = $.CONSUME(T.Pub).image;
                    lawless = $.CONSUME(T.Lawless).image;
                    $.CONSUME(T.Class);
                    name = $.CONSUME(T.Identifier).image;
                }
            },
            {
                ALT: () => {
                    lawless = $.CONSUME1(T.Lawless).image;
                    $.CONSUME1(T.Class);
                    name = $.CONSUME1(T.Identifier).image;
                }
            },
            {
                ALT: () => {
                    $.CONSUME2(T.Class);
                    name = $.CONSUME2(T.Identifier).image;
                }
            },
            {
                ALT: () => {
                    pub = $.CONSUME1(T.Pub).image;
                    $.CONSUME3(T.Class);
                    name = $.CONSUME3(T.Identifier).image;
                }
            }
        ]);
        let type = $.SUBRULE($.singleBracketWithType);
        return pub + " " + lawless + " class " + name + type + " ";;
    });
}