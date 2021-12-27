// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var comment: any;
declare var NL: any;
declare var identifier: any;
declare var lbracket: any;
declare var rbracket: any;
declare var lbrace: any;
declare var rbrace: any;
declare var divider: any;
declare var assignement: any;
declare var lparen: any;
declare var rparen: any;
declare var comma: any;
declare var pubdef: any;
declare var space: any;

import * as moo from 'moo';

const escapes: { [key: string]: string } = {
	n: '\n', r: '\r', t: '\t', v: '\v', 0: '\0', f: '\f', b: '\b',
	'"': '"', '\\': '\\',
}
function unescape (str: string): string {
	return str.replace(
		/\\(?:([nrtv0fb"\\])|u\{([0-9a-fA-F]+)\}|\{(.|[\uD800-\uDBFF][\uDC00-\uDFFF])\})/g,
		(_, name, unicode, char) => name
			? escapes[name]
			: unicode
			? String.fromCodePoint(parseInt(unicode, 16))
			: char
	)
}

function returnAllData(type: string, a: any[]){
    return {type: type, data: a}
}

function nullify(d: any) { return null; }

const appendItem = (a: any, b: any): any => { 
    return (d: any) => { 
        console.log("append: " + JSON.stringify(d));
        console.log("append d[a]: " + JSON.stringify(d[a]));
        return d.concat([d[b]]); 
    } 
};

let lexer = moo.compile({    
    //comment: /\/\/.*[\n|\r\n]+/,
    comment: /\/\/.*/,
    space: { match: /\s/, lineBreaks: true },
    NL: { match: /[\n|\r\n]+/, lineBreaks: true },
    //keywords: ['interface'],
    //WS:      /[ \t]+/,
    //WS:      { match: /[ \t\n\r]+/, lineBreaks: true },
    lparen: '(',
    rparen: ')',
    lbrace: '{',
    rbrace: '}',
    lbracket: '[',
    rbracket: ']',
    comma: ',',
    divider: [':', ';'],
    assignement: ['='],
    pubdef: 'pub def',
    identifier: /[\w.$.*]+/
});

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "main$ebnf$1", "symbols": []},
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["expression"]},
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["comment"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "main$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "main", "symbols": ["main$ebnf$1"], "postprocess": d => {return ({ type: "main", body: d[0]})}},
    {"name": "comment", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment), (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": id},
    {"name": "expression", "symbols": ["instance"]},
    {"name": "instance$ebnf$1", "symbols": []},
    {"name": "instance$ebnf$1", "symbols": ["instance$ebnf$1", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "instance", "symbols": [{"literal":"instance"}, "_", (lexer.has("identifier") ? {type: "identifier"} : identifier), (lexer.has("lbracket") ? {type: "lbracket"} : lbracket), (lexer.has("identifier") ? {type: "identifier"} : identifier), (lexer.has("rbracket") ? {type: "rbracket"} : rbracket), "_", (lexer.has("lbrace") ? {type: "lbrace"} : lbrace), "_", "instanceBody", (lexer.has("rbrace") ? {type: "rbrace"} : rbrace), "instance$ebnf$1"], "postprocess": d => {return { type: "instance", name: d[2], instanceTypeInfo: [4], body: d[5]}}},
    {"name": "instanceBody", "symbols": ["method"]},
    {"name": "method", "symbols": ["pubdef", "__", (lexer.has("identifier") ? {type: "identifier"} : identifier), "_", "argsWithParenWithType", "_", (lexer.has("divider") ? {type: "divider"} : divider), "_", "returnType", "_", (lexer.has("assignement") ? {type: "assignement"} : assignement), "_", "methodBody", "_"]},
    {"name": "argsWithParenWithType$ebnf$1", "symbols": []},
    {"name": "argsWithParenWithType$ebnf$1", "symbols": ["argsWithParenWithType$ebnf$1", "arglistWithType"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "argsWithParenWithType", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "_", "argsWithParenWithType$ebnf$1", "_", (lexer.has("rparen") ? {type: "rparen"} : rparen)]},
    {"name": "arglistWithType$ebnf$1", "symbols": []},
    {"name": "arglistWithType$ebnf$1", "symbols": ["arglistWithType$ebnf$1", (lexer.has("comma") ? {type: "comma"} : comma)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "arglistWithType", "symbols": ["param", "_", (lexer.has("divider") ? {type: "divider"} : divider), "_", "paramType", "_", "arglistWithType$ebnf$1", "_"]},
    {"name": "param", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "paramType", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "pubdef", "symbols": [{"literal":"def"}]},
    {"name": "pubdef", "symbols": [(lexer.has("pubdef") ? {type: "pubdef"} : pubdef)]},
    {"name": "returnType", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "methodBody", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "argsWithParen"]},
    {"name": "argsWithParen$ebnf$1", "symbols": []},
    {"name": "argsWithParen$ebnf$1", "symbols": ["argsWithParen$ebnf$1", "arglist"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "argsWithParen", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "_", "argsWithParen$ebnf$1", "_", (lexer.has("rparen") ? {type: "rparen"} : rparen)]},
    {"name": "arglist$ebnf$1", "symbols": []},
    {"name": "arglist$ebnf$1", "symbols": ["arglist$ebnf$1", (lexer.has("comma") ? {type: "comma"} : comma)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "arglist", "symbols": ["param", "_", "arglist$ebnf$1", "_"]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("space") ? {type: "space"} : space)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"]},
    {"name": "__$ebnf$1", "symbols": [(lexer.has("space") ? {type: "space"} : space)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", (lexer.has("space") ? {type: "space"} : space)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "__", "symbols": ["__$ebnf$1"]}
  ],
  ParserStart: "main",
};

export default grammar;
