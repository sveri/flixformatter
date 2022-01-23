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
        $.OPTION(() => $.OR1([
            // [String]
            { ALT: () => type = $.SUBRULE($.singleBracketWithType)},
            // [m: Type -> Type]
            { ALT: () => type = $.SUBRULE($.bracketWithArgumentTypeApplication)},
        ]));
        return type;
    });

    // x: Float32
    // x: Float32[m -> m] 
    // x: Float32[m -> m & e] 
    $.RULE("differentMethodArgumentsType", () => {
        let element = $.SUBRULE($.argumentWithSimpleType);

        $.OPTION(() => {
            $.CONSUME(T.LSquare);                    
            element += "[";

            element += $.SUBRULE($.typeToTypeApplication);
            $.OPTION1(() => {element += " " + $.SUBRULE($.andType);});
            
            $.CONSUME(T.RSquare);
            element += "]";
        });
        return element;
    });

    // Float32
    // Float32[m]
    $.RULE("methodReturnType", () => {
        $.CONSUME(T.Colon);
        let type = $.SUBRULE($.oneOfTheTypes);
        $.OPTION(() => type += $.SUBRULE($.singleBracketWithType));
        let andType = "";
        $.OPTION1(() => andType = $.SUBRULE($.andType));
        return ": " + type + emptySpaceIfNotEmpty(andType) + andType;
    });

    // x: Float32
    $.RULE("argumentWithSimpleType", () => {
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

    //[m: Type -> Type]
    $.RULE("bracketWithArgumentTypeApplication", () => {
        $.CONSUME(T.LSquare);
        let varName = $.CONSUME(T.Identifier);
        $.CONSUME(T.Colon);
        let typeApplication = $.SUBRULE($.typeToTypeApplication);
        $.CONSUME(T.RSquare);
        return "[" + varName.image + ": " + typeApplication + "]";
    });

    //m: Type -> Type
    $.RULE("argumentTypeApplication", () => {
        let varName = $.CONSUME(T.Identifier);
        $.CONSUME(T.Colon);
        let typeApplication = $.SUBRULE($.typeToTypeApplication);
        return "[" + varName.image + ": " + typeApplication + "]";
    });

    //Type -> Type
    $.RULE("typeToTypeApplication", () => {
        let type1 = $.SUBRULE($.oneOfTheTypes);
        $.CONSUME(T.TypeApplication);
        let type2 = $.SUBRULE1($.oneOfTheTypes);
        return type1 + " -> " + type2;
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