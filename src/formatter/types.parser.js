/* eslint-disable @typescript-eslint/naming-convention */
"use strict";
import * as T from './token';



function emptySpaceIfNotEmpty(s) {
    return (s !== undefined && s !== "") ? " " : "";
}

export function defineTypes($, t) {

    // [String]
    // [m: Type -> Type]
    $.RULE("classArgumentType", () => {
        let type = "";
        $.OPTION(() =>  type = $.CONSUME(T.BetweenBrackets));
        return type.image === undefined ? "" : type.image;
    });

    // Float32
    // Float32[m]
    $.RULE("methodReturnType", () => {
        $.CONSUME(T.Colon);
        let type = $.SUBRULE($.oneOfTheTypes);
        let bp = "";
        $.OPTION(() => bp = $.CONSUME(T.BetweenBrackets));
        if(bp.image !== undefined){
            type += bp.image;
        } 
        let andType = "";
        $.OPTION1(() => andType = $.SUBRULE($.andType));
        return ": " + type + emptySpaceIfNotEmpty(andType) + andType;
    });

    //& e
    $.RULE("andType", () => {
        $.CONSUME(T.Ampersand);
        let type = $.SUBRULE($.oneOfTheTypes);
        return "& " + type;
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