/* eslint-disable @typescript-eslint/naming-convention */
"use strict";
import * as T from './token';

export function defineMethod($, t) {

    $.RULE("method", () => {
        const pubDef = $.CONSUME(T.PubDef);
        const methodName = $.CONSUME(T.Identifier);

        let methodArguments = $.SUBRULE($.methodArguments);
        let returnType = $.SUBRULE($.methodReturnType);

        let assignment;
        let methodBody = "";
        $.OPTION(() => assignment = $.CONSUME(T.Assignment));
        $.OPTION1(() => methodBody = $.methodBody());

        if (assignment === undefined) {
            assignment = "";
        } else {
            assignment = " =";
        }

        if (methodBody !== undefined && methodBody.trim().length > 0
            && (methodBody.length + pubDef.image.length + methodName.image.length + methodArguments.length
                + returnType.length < 118)) {
            methodBody = " " + methodBody.trim() + "\n";
        } else {
            methodBody = "\n" + methodBody;
        }
        return $.getIndentation() + pubDef.image + " " + methodName.image + methodArguments
            + returnType + assignment + methodBody;
    });

    $.RULE("methodArguments", () => {
        let bp = $.CONSUME(T.BetweenParenthesis);
        return bp.image;
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
                    { ALT: () => result += $.SUBRULE($.classWithFunctionCall) },
                ]);
            },
        });
        $.indentationLevel--;

        return result;
    });

    // Applicative.ap(Functor.map(f, x1), x2)
    $.RULE("classWithFunctionCall", () => {
        let mc = $.CONSUME(T.ArbitraryMethodCallWithArguments);
        return $.getIndentation() + mc.image + "\n";
    });

    // (x \`concat\` y) as & Pure
    $.RULE("completeJavaMethodCallWithType", () => {
        let methodCall = $.CONSUME(T.BetweenParenthesis);

        $.CONSUME(T.As);

        $.CONSUME(T.Ampersand);

        let type = $.SUBRULE($.oneOfTheTypes);

        return $.getIndentation() + methodCall.image + " as & " + type + "\n";
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
        let bp = $.CONSUME(T.BetweenParenthesis);

        return $.getIndentation() + call.image + bp.image + "\n";
    });
}