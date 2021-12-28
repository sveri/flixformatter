// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var comment: any;
declare var identifier: any;
declare var lbracket: any;
declare var rbracket: any;
declare var lbrace: any;
declare var rbrace: any;
declare var pub: any;
declare var lawless: any;
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

let lexer = moo.compile({    
    //comment: /\/\/.*[\n|\r\n]+/,
    comment: /\/\/.*/,
    space: { match: /\s/, lineBreaks: true },
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
    pub: 'pub',
    lawless: 'lawless',
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
    {"name": "comment", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment), "_"], "postprocess": d => {return d[0]}},
    {"name": "expression", "symbols": ["instance"], "postprocess": id},
    {"name": "expression", "symbols": ["class"], "postprocess": id},
    {"name": "instance", "symbols": [{"literal":"instance"}, "__", (lexer.has("identifier") ? {type: "identifier"} : identifier), (lexer.has("lbracket") ? {type: "lbracket"} : lbracket), (lexer.has("identifier") ? {type: "identifier"} : identifier), (lexer.has("rbracket") ? {type: "rbracket"} : rbracket), "_", (lexer.has("lbrace") ? {type: "lbrace"} : lbrace), "_", "instanceBody", (lexer.has("rbrace") ? {type: "rbrace"} : rbrace), "_"], "postprocess": d => {return { type: "instance", name: d[2], instanceTypeInfo: d[4], body: d[9]}}},
    {"name": "instanceBody", "symbols": ["method"], "postprocess": id},
    {"name": "class", "symbols": [(lexer.has("pub") ? {type: "pub"} : pub), "__", "lawless", {"literal":"class"}, "__", (lexer.has("identifier") ? {type: "identifier"} : identifier), (lexer.has("lbracket") ? {type: "lbracket"} : lbracket), (lexer.has("identifier") ? {type: "identifier"} : identifier), (lexer.has("rbracket") ? {type: "rbracket"} : rbracket), "__", (lexer.has("lbrace") ? {type: "lbrace"} : lbrace), "_", "classBody", "_", (lexer.has("rbrace") ? {type: "rbrace"} : rbrace)], "postprocess": d => { return { type: "class", lawless: d[2], name: d[5], classTypeInfo: d[7], body: d[12]}}},
    {"name": "lawless$ebnf$1", "symbols": []},
    {"name": "lawless$ebnf$1$subexpression$1", "symbols": [(lexer.has("lawless") ? {type: "lawless"} : lawless), "__"]},
    {"name": "lawless$ebnf$1", "symbols": ["lawless$ebnf$1", "lawless$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "lawless", "symbols": ["lawless$ebnf$1"], "postprocess": d => {if(d[0][0] === undefined) return {lawless: false}; else return {lawless: true};}},
    {"name": "classBody$ebnf$1", "symbols": []},
    {"name": "classBody$ebnf$1$subexpression$1", "symbols": ["comment"]},
    {"name": "classBody$ebnf$1$subexpression$1", "symbols": ["method"]},
    {"name": "classBody$ebnf$1", "symbols": ["classBody$ebnf$1", "classBody$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "classBody", "symbols": ["classBody$ebnf$1"], "postprocess": id},
    {"name": "method", "symbols": ["pubdef", "__", (lexer.has("identifier") ? {type: "identifier"} : identifier), "_", "argsWithParenWithType", "_", (lexer.has("divider") ? {type: "divider"} : divider), "_", "returnType"], "postprocess": d => {return { type: "methodDeclaration", pubdef: d[0], name: d[2], args: d[4], returnType: d[8]}}},
    {"name": "method", "symbols": ["pubdef", "__", (lexer.has("identifier") ? {type: "identifier"} : identifier), "_", "argsWithParenWithType", "_", (lexer.has("divider") ? {type: "divider"} : divider), "_", "returnType", "_", (lexer.has("assignement") ? {type: "assignement"} : assignement), "_", "methodBody", "_"], "postprocess": d => {return { type: "method", pubdef: d[0], name: d[2], args: d[4], returnType: d[8], body: d[12]}}},
    {"name": "argsWithParenWithType$ebnf$1", "symbols": []},
    {"name": "argsWithParenWithType$ebnf$1", "symbols": ["argsWithParenWithType$ebnf$1", "arglistWithType"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "argsWithParenWithType", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "_", "argsWithParenWithType$ebnf$1", "_", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": d => ({ type: "argsWithParenWithType", args: d[2]})},
    {"name": "arglistWithType$ebnf$1", "symbols": []},
    {"name": "arglistWithType$ebnf$1", "symbols": ["arglistWithType$ebnf$1", (lexer.has("comma") ? {type: "comma"} : comma)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "arglistWithType", "symbols": ["param", "_", (lexer.has("divider") ? {type: "divider"} : divider), "_", "paramType", "_", "arglistWithType$ebnf$1", "_"], "postprocess": d => ({ type: "arglistWithType", param: d[0], paramType: d[4]})},
    {"name": "param", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": id},
    {"name": "paramType", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": id},
    {"name": "pubdef", "symbols": [{"literal":"def"}]},
    {"name": "pubdef", "symbols": [(lexer.has("pubdef") ? {type: "pubdef"} : pubdef)], "postprocess": id},
    {"name": "returnType", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": id},
    {"name": "methodBody", "symbols": ["shortMethodBody"], "postprocess": id},
    {"name": "methodBody", "symbols": ["longMethodBody"], "postprocess": id},
    {"name": "shortMethodBody", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "argsWithParen"], "postprocess": d => ({ type: "shortMethodBody", name: d[0], args: d[1]})},
    {"name": "longMethodBody", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "argsWithParen$ebnf$1", "symbols": []},
    {"name": "argsWithParen$ebnf$1", "symbols": ["argsWithParen$ebnf$1", "arglist"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "argsWithParen", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "_", "argsWithParen$ebnf$1", "_", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": d => ({ type: "argsWithParen", args: d[2]})},
    {"name": "arglist$ebnf$1", "symbols": []},
    {"name": "arglist$ebnf$1", "symbols": ["arglist$ebnf$1", (lexer.has("comma") ? {type: "comma"} : comma)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "arglist", "symbols": ["param", "_", "arglist$ebnf$1", "_"], "postprocess": d => ({ type: "arglist", param: d[0]})},
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
