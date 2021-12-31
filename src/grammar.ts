// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }

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

function flatten<T>(arr: T[][]): T[] {
  return ([] as T[]).concat(...arr);
}

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
  Lexer: undefined,
  ParserRules: [
    {"name": "main$ebnf$1", "symbols": []},
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["expression"]},
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["comment"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "main$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "main", "symbols": ["main$ebnf$1"], "postprocess": d => {return ({ type: "main", body: flatten(d[0])})}},
    {"name": "comment", "symbols": ["singleLineComment"], "postprocess": id},
    {"name": "comment", "symbols": ["multiLineComment"], "postprocess": id},
    {"name": "singleLineComment$string$1", "symbols": [{"literal":"/"}, {"literal":"/"}], "postprocess": (d) => d.join('')},
    {"name": "singleLineComment$ebnf$1", "symbols": []},
    {"name": "singleLineComment$ebnf$1", "symbols": ["singleLineComment$ebnf$1", /[ \w/\.\`]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "singleLineComment", "symbols": ["_", "singleLineComment$string$1", "singleLineComment$ebnf$1", /[\n]/], "postprocess": d => {return ({type: "comment", text: d[1] + d[2].join("")})}},
    {"name": "multiLineComment$string$1", "symbols": [{"literal":"/"}, {"literal":"*"}], "postprocess": (d) => d.join('')},
    {"name": "multiLineComment$ebnf$1", "symbols": []},
    {"name": "multiLineComment$ebnf$1", "symbols": ["multiLineComment$ebnf$1", /[ \w/\.\`\n]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "multiLineComment$string$2", "symbols": [{"literal":"*"}, {"literal":"/"}], "postprocess": (d) => d.join('')},
    {"name": "multiLineComment", "symbols": ["_", "multiLineComment$string$1", "multiLineComment$ebnf$1", "multiLineComment$string$2", "_"], "postprocess": d => {return ({type: "multiLineComment", text: d[2].join("")})}},
    {"name": "expression", "symbols": ["instance"], "postprocess": id},
    {"name": "expression", "symbols": ["class"], "postprocess": id},
    {"name": "instance$string$1", "symbols": [{"literal":"i"}, {"literal":"n"}, {"literal":"s"}, {"literal":"t"}, {"literal":"a"}, {"literal":"n"}, {"literal":"c"}, {"literal":"e"}], "postprocess": (d) => d.join('')},
    {"name": "instance", "symbols": ["instance$string$1", "__", "identifier", "lbracket", "identifier", "rbracket", "_", "lbrace", "_", "instanceBody", "rbrace", "_"], "postprocess": d => {return { type: "instance", name: d[2], instanceTypeInfo: d[4], body: d[9]}}},
    {"name": "instanceBody", "symbols": ["method"], "postprocess": id},
    {"name": "class$string$1", "symbols": [{"literal":"c"}, {"literal":"l"}, {"literal":"a"}, {"literal":"s"}, {"literal":"s"}], "postprocess": (d) => d.join('')},
    {"name": "class", "symbols": ["pub", "__", "lawless", "class$string$1", "__", "identifier", "lbracket", "identifier", "rbracket", "__", "lbrace", "_", "classBody", "_", "rbrace"], "postprocess": d => { return { type: "class", lawless: d[2], name: d[5], classTypeInfo: d[7], body: d[12]}}},
    {"name": "lawless$ebnf$1", "symbols": []},
    {"name": "lawless$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"l"}, {"literal":"a"}, {"literal":"w"}, {"literal":"l"}, {"literal":"e"}, {"literal":"s"}, {"literal":"s"}], "postprocess": (d) => d.join('')},
    {"name": "lawless$ebnf$1$subexpression$1", "symbols": ["lawless$ebnf$1$subexpression$1$string$1", "__"]},
    {"name": "lawless$ebnf$1", "symbols": ["lawless$ebnf$1", "lawless$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "lawless", "symbols": ["lawless$ebnf$1"], "postprocess": d => {if(d[0][0] === undefined) return {lawless: false}; else return {lawless: true};}},
    {"name": "classBody$ebnf$1", "symbols": []},
    {"name": "classBody$ebnf$1$subexpression$1", "symbols": ["comment"]},
    {"name": "classBody$ebnf$1$subexpression$1", "symbols": ["method"]},
    {"name": "classBody$ebnf$1", "symbols": ["classBody$ebnf$1", "classBody$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "classBody", "symbols": ["classBody$ebnf$1"], "postprocess": d => {return flatten(d[0])}},
    {"name": "method", "symbols": ["_", "pubdef", "__", "identifier", "_", "argsWithParenWithType", "_", "colon", "_", "returnType"], "postprocess": d => {return { type: "methodDeclaration", pubdef: d[1], name: d[3], args: d[5], returnType: d[9]}}},
    {"name": "method", "symbols": ["_", "pubdef", "__", "identifier", "_", "argsWithParenWithType", "_", "colon", "_", "returnType", "_", "assignement", "_", "methodBody", "_"], "postprocess": d => {return { type: "method", pubdef: d[1], name: d[3], args: d[5], returnType: d[9], body: flatten(d[13])}}},
    {"name": "argsWithParenWithType$ebnf$1", "symbols": []},
    {"name": "argsWithParenWithType$ebnf$1", "symbols": ["argsWithParenWithType$ebnf$1", "arglistWithType"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "argsWithParenWithType", "symbols": ["lparen", "_", "argsWithParenWithType$ebnf$1", "_", "rparen"], "postprocess": d => ({ type: "argsWithParenWithType", args: d[2]})},
    {"name": "arglistWithType$ebnf$1", "symbols": []},
    {"name": "arglistWithType$ebnf$1", "symbols": ["arglistWithType$ebnf$1", "comma"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "arglistWithType", "symbols": ["param", "_", "colon", "_", "paramType", "_", "arglistWithType$ebnf$1", "_"], "postprocess": d => ({ type: "arglistWithType", param: d[0], paramType: d[4]})},
    {"name": "param", "symbols": ["identifier"], "postprocess": id},
    {"name": "paramType", "symbols": ["identifier"], "postprocess": id},
    {"name": "returnType", "symbols": ["identifier"], "postprocess": id},
    {"name": "methodBody", "symbols": ["shortMethodBody"], "postprocess": id},
    {"name": "methodBody", "symbols": ["longMethodBody"], "postprocess": id},
    {"name": "shortMethodBody", "symbols": ["identifier", "argsWithParen"], "postprocess": d => ([{ type: "shortMethodBody", name: d[0], args: d[1]}])},
    {"name": "argsWithParen$ebnf$1", "symbols": []},
    {"name": "argsWithParen$ebnf$1", "symbols": ["argsWithParen$ebnf$1", "arglist"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "argsWithParen", "symbols": ["lparen", "_", "argsWithParen$ebnf$1", "_", "rparen"], "postprocess": d => ({ type: "argsWithParen", args: d[2]})},
    {"name": "arglist$ebnf$1", "symbols": []},
    {"name": "arglist$ebnf$1", "symbols": ["arglist$ebnf$1", "comma"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "arglist", "symbols": ["param", "_", "arglist$ebnf$1", "_"], "postprocess": d => ({ type: "arglist", param: d[0]})},
    {"name": "longMethodBody$ebnf$1$subexpression$1", "symbols": ["import"]},
    {"name": "longMethodBody$ebnf$1$subexpression$1", "symbols": ["methodLine"]},
    {"name": "longMethodBody$ebnf$1", "symbols": ["longMethodBody$ebnf$1$subexpression$1"]},
    {"name": "longMethodBody$ebnf$1$subexpression$2", "symbols": ["import"]},
    {"name": "longMethodBody$ebnf$1$subexpression$2", "symbols": ["methodLine"]},
    {"name": "longMethodBody$ebnf$1", "symbols": ["longMethodBody$ebnf$1", "longMethodBody$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "longMethodBody", "symbols": ["longMethodBody$ebnf$1"], "postprocess": id},
    {"name": "import$subexpression$1$string$1", "symbols": [{"literal":"i"}, {"literal":"m"}, {"literal":"p"}, {"literal":"o"}, {"literal":"r"}, {"literal":"t"}], "postprocess": (d) => d.join('')},
    {"name": "import$subexpression$1", "symbols": ["import$subexpression$1$string$1", "__"]},
    {"name": "import$ebnf$1", "symbols": []},
    {"name": "import$ebnf$1$subexpression$1", "symbols": [{"literal":"."}, "identifier"]},
    {"name": "import$ebnf$1", "symbols": ["import$ebnf$1", "import$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "import", "symbols": ["_", "import$subexpression$1", "identifier", "import$ebnf$1", "lparen", "identifier", "rparen", {"literal":";"}], "postprocess": d => {return { type: "javaImport", identifierOne: d[2], identifier: flatten(d[3]), parenIdentifier: d[5]}}},
    {"name": "methodLine$ebnf$1", "symbols": []},
    {"name": "methodLine$ebnf$1", "symbols": ["methodLine$ebnf$1", /[ \w/\.\`\(\)&]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "methodLine", "symbols": ["_", "methodLine$ebnf$1", {"literal":"\n"}], "postprocess": d => {return { type: "methodLine", line: d[1].join("").trim()}}},
    {"name": "pub$string$1", "symbols": [{"literal":"p"}, {"literal":"u"}, {"literal":"b"}], "postprocess": (d) => d.join('')},
    {"name": "pub", "symbols": ["pub$string$1"], "postprocess": d => {return d[0]}},
    {"name": "pubdef$string$1", "symbols": [{"literal":"p"}, {"literal":"u"}, {"literal":"b"}, {"literal":" "}, {"literal":"d"}, {"literal":"e"}, {"literal":"f"}], "postprocess": (d) => d.join('')},
    {"name": "pubdef", "symbols": ["pubdef$string$1"]},
    {"name": "pubdef$string$2", "symbols": [{"literal":"d"}, {"literal":"e"}, {"literal":"f"}], "postprocess": (d) => d.join('')},
    {"name": "pubdef", "symbols": ["pubdef$string$2"], "postprocess": d => {return d[0].join("")}},
    {"name": "identifier$ebnf$1", "symbols": [/[a-zA-Z0-9$_]/]},
    {"name": "identifier$ebnf$1", "symbols": ["identifier$ebnf$1", /[a-zA-Z0-9$_]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "identifier", "symbols": ["identifier$ebnf$1"], "postprocess": d => {return d[0].join("")}},
    {"name": "lparen", "symbols": [{"literal":"("}]},
    {"name": "rparen", "symbols": [{"literal":")"}]},
    {"name": "lbracket", "symbols": [{"literal":"["}]},
    {"name": "rbracket", "symbols": [{"literal":"]"}]},
    {"name": "lbrace", "symbols": [{"literal":"{"}]},
    {"name": "rbrace", "symbols": [{"literal":"}"}]},
    {"name": "colon", "symbols": [{"literal":":"}]},
    {"name": "comma", "symbols": [{"literal":","}]},
    {"name": "assignement", "symbols": [{"literal":"="}]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s\n]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"]},
    {"name": "__$ebnf$1", "symbols": [/[\s]/]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", /[\s]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "__", "symbols": ["__$ebnf$1"]}
  ],
  ParserStart: "main",
};

export default grammar;
