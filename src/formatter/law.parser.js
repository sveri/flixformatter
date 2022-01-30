/* eslint-disable @typescript-eslint/naming-convention */
"use strict";
import * as T from './token';

export function defineLaw($, t) {

    $.RULE("law", () => {
        let law = $.CONSUME(T.LawUntilWithEquals);
        let mc;
        $.OR([
            { ALT: () => mc = $.CONSUME(T.ArbitraryMethodCallWithArguments)},
            { ALT: () => mc = $.CONSUME(T.Identifier)},
        ]);
        return $.getIndentation() + law.image + " " + mc.image + "\n\n";
    });


}