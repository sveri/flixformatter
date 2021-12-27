@{%
const moo = require("moo");

let lexer = moo.compile({    
    two: /[\d]+/,
    operator: /[+]+/,
    NL:      { match: /\n/, lineBreaks: true },
    comment: /\/\//,
});

%}


@lexer lexer

main -> line
    | main line

line -> expression:*

expression -> two %operator two 
    
two -> %two


############# works

# expression -> line:*

# line -> two %operator two 
#     | expression two %operator two 
    
# two -> %two
############# end works

# widget -> _ %openBrace _ %identifier _ arglist _ %closeBrace _ {% d => { return {widget:d[3].value, args:d[5]}} %}

# # a widget can have 0 or more args
# arglist -> arg:* {% d => d[0] %}

# # an arg is a simple arg or a block arg
# arg -> simpleArg {% d => d[0] %}
#     | blockArg {% d => d[0] %}

# # a simple arg is of the form name="value"
# simpleArg -> %identifier _ %equals _ %quote %value %quote _ {% d => [d[0].value, d[5].value] %}

# # a block arg is of the form name=[[value]]
# blockArg -> %identifier _ %equals _ %openBlock %value %closeBlock _ {% d => [d[0].value, d[5].value] %}

# _ -> %ws:* {% d => null %}



    # comment: { match: /[\/\/|]/},
    # NL:      { match: /\n/, lineBreaks: true },
    # WNL:      { match: /\r\n/, lineBreaks: true },
    # ws: {match: /\s+/, lineBreaks: true},
    # identifier: /[a-zA-Z_][a-zA-Z_0-9]*/
# comment: { match: /[\/\/.*?$|][^\n]+/, value: (s) => s.slice(1).trim() },

# Pass your lexer object using the @lexer option:
