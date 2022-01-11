/* eslint-disable @typescript-eslint/naming-convention */
"use strict";


import * as T from './token';

export function defineMethod($, t) {

    $.RULE("method", () => {
        const pubDef = $.CONSUME(T.PubDef);
        const methodName = $.CONSUME(T.Identifier);

        let argumentsWithType = [];
        $.CONSUME(T.LParen);
        $.MANY_SEP({
            SEP: T.Comma, DEF: () => {
                let element = "";
                element = $.SUBRULE($.argumentsWithSimpleType);
                $.OPTION(() => { element += $.SUBRULE($.bracketWithSimpleTypeApplication);});
                argumentsWithType.push(element);
            }
        });
        $.CONSUME(T.RParen);
        let returnType = $.SUBRULE($.methodReturnType);
        let assignment;
        let methodBody = "";
        $.OPTION1(() => { assignment = $.CONSUME(T.Assignment); });
        $.OPTION2(() => { methodBody = $.methodBody(); });

        if (assignment === undefined) {
            assignment = "";
        } else {
            assignment = " =";
        }

        if (methodBody !== undefined && methodBody.trim().length > 0
            && (methodBody.length + pubDef.image.length + methodName.image.length + argumentsWithType.join(", ").length
                + returnType.length < 118)) {
                    methodBody = " " + methodBody.trim() + "\n";
        } else {            
            methodBody = "\n" + methodBody;
        }
        return $.getIndentation() + pubDef.image + " " + methodName.image + "(" + argumentsWithType.join(", ") + ")"
            + returnType + assignment + methodBody;
    });

    $.RULE("methodReturnType", () => {
        $.CONSUME(T.Colon);
        let type = $.SUBRULE($.oneOfTheTypes);
        return ": " + type;
    });

    $.RULE("methodBody", () => {
        let result = "";
        $.indentationLevel++;
        $.MANY({
            DEF: () => {
                $.OR([
                    { ALT: () => result += $.SUBRULE($.referenceMethodCall) },
                    { ALT: () => result += $.SUBRULE($.javaImport) },
                    { ALT: () => result += $.SUBRULE($.completeJavaMethodCallWithType) },
                ]);
            },
        });
        $.indentationLevel--;

        return result;
    });

    // (x \`concat\` y) as & Pure
    $.RULE("completeJavaMethodCallWithType", () => {
        $.CONSUME(T.LParen);
        let lhs = $.SUBRULE($.lhsOfJavaMethodCall);
        let method = $.CONSUME(T.JavaMethodCall);
        let rhs = $.SUBRULE($.rhsOfJavaMethodCall);
        $.CONSUME(T.RParen);

        $.CONSUME(T.As);

        $.CONSUME(T.Ampersand);

        let type = $.SUBRULE($.oneOfTheTypes);

        // return call.image + "(" + callIdentifier.join(", ") + ")";
        return $.getIndentation() + "(" + lhs + " " + method.image + " " +
            rhs + ") as & " + type + "\n";
    });

    $.RULE("lhsOfJavaMethodCall", () => {
        let imports = $.CONSUME(T.Identifier);
        return imports.image;
    });

    $.RULE("rhsOfJavaMethodCall", () => {
        let imports = $.CONSUME(T.Identifier);
        return imports.image;
    });

    $.RULE("javaImport", () => {
        let imports = $.CONSUME(T.JavaImport);

        return $.getIndentation() + imports.image + "\n";
    });

    // $FLOAT32_ADD$(x, y)
    $.referenceMethodCall = $.RULE("referenceMethodCall", () => {
        let call = $.CONSUME(T.ReferenceMethodCall);

        let argumentsWithoutType = [];
        $.CONSUME(T.LParen);
        $.MANY_SEP({
            SEP: T.Comma, DEF: () => {
                argumentsWithoutType.push($.SUBRULE($.argumentsWithouthType));
            }
        });
        $.CONSUME(T.RParen);

        return $.getIndentation() + call.image + "(" + argumentsWithoutType.join(", ") + ")\n";
    });

    // (x, y)
    $.RULE("argumentsWithouthType", () => {
        let param = $.CONSUME(T.Identifier);
        return param.image;
    });
}