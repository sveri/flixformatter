@preprocessor typescript
# @builtin "whitespace.ne"
# @builtin "number.ne"

@{%
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
%}

# main -> (expression | comment ):* {% d => {return ({ type: "main", body: flatten(d[0])})} %}
# main -> (expression | comment ):* {% d => {console.log("maein: " + JSON.stringify(flatten(d[0]))); return ({ type: "main", body: flatten(d[0])})} %}
main -> (expression | comment ):* {% d => {return ({ type: "main", body: flatten(d[0])})} %}


# comment -> [\s]:* "//" [ \w/\.\`]:* [\n] {% d => {console.log("comment " + JSON.stringify(d[1] + d[2].join(""))); return ({type: "comment", text: d[1] + d[2].join("")})} %}
# comment -> _ "//" [ \w/\.\`]:* [\n] {% d => {return ({type: "comment", text: d[1] + d[2].join("")})} %}
# 	| _ "/*"  [ \w/\.\`\n]:*  "*/" {% d => {return ({type: "multiLine", text: d[2].join("")})} %}

comment -> singleLineComment {% id %}
	| multiLineComment {% id %}

singleLineComment ->  _ "//" [ \w/\.\`]:* [\n] {% d => {return ({type: "comment", text: d[1] + d[2].join("")})} %}
# multiLine -> _ "dd"  [ \w/\.\`]:* "dd"
multiLineComment -> _ "/*" [ \w/\.\`\n]:* "*/" _
 {% d => {return ({type: "multiLineComment", text: d[2].join("")})} %}
#  {% d => {console.log("multiLine " + JSON.stringify(({type: "multiLine", text: d[2]}))); return ({type: "multiLineComment", text: d[2].join("")})} %}

expression -> instance {% id %}
    | class {% id %}

# instance Add[Float32] {
instance -> "instance" __ identifier lbracket identifier rbracket _ lbrace _ instanceBody rbrace _
{% d => {return { type: "instance", name: d[2], instanceTypeInfo: d[4], body: d[9]}} %}

instanceBody -> method {% id %}

# class
class -> pub __ lawless "class" __  identifier lbracket identifier rbracket __ lbrace _ classBody _ rbrace
{% d => { return { type: "class", lawless: d[2], name: d[5], classTypeInfo: d[7], body: d[12]}} %}

lawless -> ("lawless" __):* {% d => {if(d[0][0] === undefined) return {lawless: false}; else return {lawless: true};} %}

# classBody -> (comment | method):* {% d => {console.log("classBody: " + JSON.stringify(flatten(d[0]))); return flatten(d[0])} %}
classBody -> (comment | method):* {% d => {return flatten(d[0])} %}

            # pub def add(x: a, y: a): a
method -> _ pubdef __ identifier _ argsWithParenWithType _ colon _ returnType
    {% d => {return { type: "methodDeclaration", pubdef: d[1], name: d[3], args: d[5], returnType: d[9]}} %}
    # pub def add(x: Float64, y: Float64): Float64 = $FLOAT64_ADD$(x, y)
    | _ pubdef __ identifier _ argsWithParenWithType _ colon _ returnType _ assignement _ methodBody _
    # {% d => {return { type: "method", pubdef: d[1], name: d[3], args: d[5], returnType: d[9], body: d[13]}} %}
    {% d => {return { type: "method", pubdef: d[1], name: d[3], args: d[5], returnType: d[9], body: flatten(d[13])}} %}



# (x: Float32, y: Float32)
argsWithParenWithType -> lparen _ arglistWithType:* _ rparen
{% d => ({ type: "argsWithParenWithType", args: d[2]}) %}
arglistWithType -> param _ colon _ paramType _ comma:* _
{% d => ({ type: "arglistWithType", param: d[0], paramType: d[4]}) %}

param -> identifier {% id %}
paramType -> identifier {% id %}
returnType -> identifier {% id %}

methodBody -> shortMethodBody {% id %} | longMethodBody {% id %}

# = $FLOAT32_ADD$(x, y)
shortMethodBody -> identifier argsWithParen
# {% d => ({ type: "shortMethodBody", name: d[0], args: d[1]}) %}
{% d => ([{ type: "shortMethodBody", name: d[0], args: d[1]}]) %}
# (x, y)
argsWithParen -> lparen _ arglist:* _ rparen
{% d => ({ type: "argsWithParen", args: d[2]}) %}
arglist -> param _ comma:* _
{% d => ({ type: "arglist", param: d[0]}) %}


longMethodBody -> (import | methodLine):+ {% id %}

import -> _ ("import" __) identifier ("." identifier):* lparen identifier rparen ";"
{% d => {return { type: "javaImport", identifierOne: d[2], identifier: flatten(d[3]), parenIdentifier: d[5]}} %}

methodLine -> _  [ \w/\.\`\(\)&]:*  "\n"
{% d => {return { type: "methodLine", line: d[1].join("").trim()}} %}



pub -> "pub" {% d => {return d[0]} %}
pubdef -> "pub def" | "def" {% d => {return d[0].join("")} %}
identifier -> [a-zA-Z0-9$_]:+  {% d => {return d[0].join("")} %}
# identifier -> [\w$.*]:+
lparen -> "("
rparen -> ")"
lbracket -> "["
rbracket -> "]"
lbrace -> "{"
rbrace -> "}"
colon -> ":"
comma -> ","
assignement -> "="
_ -> [\s\n]:*
__ -> [\s]:+



# maybe later


# const appendItem = (a: any, b: any): any => {
#     return (d: any) => {
#         console.log("append: " + JSON.stringify(d));
#         // console.log("append d[a]: " + JSON.stringify(d[a]));
#         return d[a].concat([d[b]]);
#     }
# };
# main -> exprs  {% d => {return ({ type: "main", body: d[0]})} %}

# exprs -> expr | exprs __ expr {% appendItem(0,2) %}

# expr -> expression | comment {% id %}
