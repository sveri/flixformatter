/* eslint-disable @typescript-eslint/naming-convention */
"use strict";
import * as T from './token';

export function defineClass($, t) {

    $.RULE("clazz", () => {
        let className = $.SUBRULE($.clazzNameWithModifier);
        $.CONSUME(T.LCurly);
        $.indentationLevel++;
        let classBody = $.SUBRULE($.classBody);
        $.indentationLevel--;
        $.CONSUME(T.RCurly);
        return className + " {\n" + classBody + "}\n\n";
    });

    $.RULE("classBody", () => {
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
    $.RULE("clazzNameWithModifier", () => {
        let pub = "", lawless = "", name = "";
        $.OR([
            {
                // pub lawless class Foo
                ALT: () => {
                    pub = $.CONSUME(T.Pub).image;
                    lawless = $.CONSUME(T.Lawless).image;
                    $.CONSUME(T.Class);
                    name = $.CONSUME(T.Identifier).image;
                }
            },
            {
                // lawless class Foo
                ALT: () => {
                    lawless = $.CONSUME1(T.Lawless).image;
                    $.CONSUME1(T.Class);
                    name = $.CONSUME1(T.Identifier).image;
                }
            },
            {
                // class Foo
                ALT: () => {
                    $.CONSUME2(T.Class);
                    name = $.CONSUME2(T.Identifier).image;
                }
            },
            {
                // pub class Foo
                ALT: () => {
                    pub = $.CONSUME1(T.Pub).image;
                    $.CONSUME3(T.Class);
                    name = $.CONSUME3(T.Identifier).image;
                }
            }
        ]);
        
        let type = $.SUBRULE($.classArgumentType);

        // Functor
        let functor = "";
        $.OPTION1(() => {
            functor += " " + $.CONSUME(T.With).image;
            functor += " ";
            functor += $.CONSUME(T.Functor).image;
            functor += $.CONSUME(T.BetweenBrackets).image;
        });
        return pub + $.emptySpaceIfNotEmpty(pub) + lawless + $.emptySpaceIfNotEmpty(lawless) 
            + "class " + name + type + functor;
    });
}