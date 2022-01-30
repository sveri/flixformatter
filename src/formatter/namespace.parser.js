/* eslint-disable @typescript-eslint/naming-convention */
"use strict";
import * as T from './token';

export function defineNamespace($, t) {

    $.RULE("namespace", () => {
        let nsName = $.SUBRULE($.namespaceNameWithModifier);
        $.CONSUME(T.LCurly);
        $.indentationLevel++;
        let cb = $.SUBRULE($.namespaceBody);
        $.indentationLevel--;
        $.CONSUME(T.RCurly);
        return nsName + " {\n" + $.removeLastCharacter(cb) + "}\n\n";
    });

    $.RULE("namespaceBody", () => {
        let result = "";

        $.MANY({
            DEF: () => {
                $.OR([
                    { ALT: () => result += $.SUBRULE($.method)},
                    { ALT: () => result += $.SUBRULE($.law)},
                    { ALT: () => result += $.SUBRULE($.singleLineComment)},
                    { ALT: () => result += $.SUBRULE($.multiLineComment)},
                ]);
            },
        });
        return result;
    });

    // pub lawless class Foo | lawless class Foo | pub class Foo | class Foo
    $.RULE("namespaceNameWithModifier", () => {
        let pub = "", lawless = "", name = "";
        $.OR([
            // {
            //     // pub lawless class Foo
            //     ALT: () => {
            //         pub = $.CONSUME(T.Pub).image;
            //         lawless = $.CONSUME(T.Lawless).image;
            //         $.CONSUME(T.Class);
            //         name = $.CONSUME(T.Identifier).image;
            //     }
            // },
            // {
            //     // lawless class Foo
            //     ALT: () => {
            //         lawless = $.CONSUME1(T.Lawless).image;
            //         $.CONSUME1(T.Class);
            //         name = $.CONSUME1(T.Identifier).image;
            //     }
            // },
            {
                // class Foo
                ALT: () => {
                    $.CONSUME2(T.Namespace);
                    name = $.CONSUME2(T.Identifier).image;
                }
            },
            // {
            //     // pub class Foo
            //     ALT: () => {
            //         pub = $.CONSUME1(T.Pub).image;
            //         $.CONSUME3(T.Class);
            //         name = $.CONSUME3(T.Identifier).image;
            //     }
            // }
        ]);

        return $.postfixEmptySpaceIfNotEmpty(pub) + $.postfixEmptySpaceIfNotEmpty(lawless) 
            + "namespace " + name;
    });
}