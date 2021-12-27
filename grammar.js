// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");

let lexer = moo.compile({    
    two: /[\d]+/,
    operator: /[+]+/,
    NL:      { match: /\n/, lineBreaks: true },
    comment: /\/\//,
});

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": ["line"]},
    {"name": "main", "symbols": ["main", "line"]},
    {"name": "line$ebnf$1", "symbols": []},
    {"name": "line$ebnf$1", "symbols": ["line$ebnf$1", "expression"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "line", "symbols": ["line$ebnf$1"]},
    {"name": "expression", "symbols": ["two", (lexer.has("operator") ? {type: "operator"} : operator), "two"]},
    {"name": "two", "symbols": [(lexer.has("two") ? {type: "two"} : two)]}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
