/* eslint-disable @typescript-eslint/naming-convention */
"use strict";


import * as T from './token';

export function defineInstance($, t) {

    $.RULE("instance", () => {
        $.CONSUME(T.Instance);
        let identifier = $.CONSUME(T.Identifier);
        let instanceType = $.CONSUME(T.BetweenBrackets);
        $.CONSUME(T.LCurly);
        $.indentationLevel++;
        let instanceBody = $.SUBRULE($.instanceBody);
        $.indentationLevel--;
        $.CONSUME(T.RCurly);
        return "instance " + identifier.image + instanceType.image + " {\n" + $.removeLastCharacter(instanceBody) + "}\n\n";
    });

    $.RULE("instanceBody", () => {
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

}