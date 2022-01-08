/* eslint-disable @typescript-eslint/naming-convention */
"use strict";

import * as T from './token';

export function defineTypes($, t) {

    // (x: Float32, y: Float32)
    $.RULE("argumentsWithType", () => {
        let param = $.CONSUME(T.Identifier);
        $.CONSUME(T.Colon);
        let paramType = $.SUBRULE($.oneOfTheTypes);
        return param.image + ": " + paramType;
    });

    //[String]
    $.RULE("singleBracketWithType", () => {
        $.CONSUME(T.LSquare);
        let instanceType = $.SUBRULE($.oneOfTheTypes);
        $.CONSUME(T.RSquare);
        return "[" + instanceType + "]";
    });

    //[m : Type -> Type]
    $.RULE("bracketWithTypeApplication", () => {
        $.CONSUME(T.LSquare);
        let varName = $.CONSUME(T.Identifier);
        $.CONSUME(T.Colon);
        let type1 = $.SUBRULE($.oneOfTheTypes);
        $.CONSUME(T.TypeApplication);
        let type2 = $.SUBRULE1($.oneOfTheTypes);
        $.CONSUME(T.RSquare);
        return "[" + varName.image + ": " + type1 + " -> " + type2 + "]";
    });

    $.RULE("oneOfTheTypes", () => {
        let typeResult = $.OR([
            { ALT: () => $.CONSUME(T.TypePure) },
            { ALT: () => $.CONSUME(T.TypeString) },
            { ALT: () => $.CONSUME(T.TypeFloat32) },
            { ALT: () => $.CONSUME(T.TypeFloat64) },
            { ALT: () => $.CONSUME(T.TypeInt8) },
            { ALT: () => $.CONSUME(T.TypeInt16) },
            { ALT: () => $.CONSUME(T.TypeInt32) },
            { ALT: () => $.CONSUME(T.TypeInt64) },
            { ALT: () => $.CONSUME(T.TypeBigInt) },
            { ALT: () => $.CONSUME(T.Identifier) },
        ]);
        return typeResult.image;
    });
}