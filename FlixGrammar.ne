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
%}

# Pass your lexer object using the @lexer option:
@lexer lexer

main -> (expression | comment ):* {% d => {return ({ type: "main", body: d[0]})} %}


comment -> %comment _ {% d => {return d[0]} %}

expression -> instance {% id %}
    | class {% id %}

# instance Add[Float32] {
instance -> "instance" __ %identifier %lbracket %identifier %rbracket _ %lbrace _ instanceBody  %rbrace _
{% d => {return { type: "instance", name: d[2], instanceTypeInfo: d[4], body: d[9]}} %}

instanceBody -> method {% id %}

# class
class -> %pub __ lawless "class" __  %identifier %lbracket %identifier %rbracket __ %lbrace _ classBody _ %rbrace
{% d => { return { type: "class", lawless: d[2], name: d[5], classTypeInfo: d[7], body: d[12]}} %}

lawless -> (%lawless __):* {% d => {if(d[0][0] === undefined) return {lawless: false}; else return {lawless: true};} %}

# classBody -> (comment | method):* {% d => {console.log(JSON.stringify(d[0])); return null} %}
classBody -> (comment | method):* {% id %}

            # pub def add(x: a, y: a): a
method -> pubdef __ %identifier _ argsWithParenWithType _ %divider _ returnType
    {% d => {return { type: "methodDeclaration", pubdef: d[0], name: d[2], args: d[4], returnType: d[8]}} %}
    # pub def add(x: Float64, y: Float64): Float64 = $FLOAT64_ADD$(x, y)
    | pubdef __ %identifier _ argsWithParenWithType _ %divider _ returnType _ %assignement _ methodBody _ 
    {% d => {return { type: "method", pubdef: d[0], name: d[2], args: d[4], returnType: d[8], body: d[12]}} %}    
    

# (x: Float32, y: Float32)
argsWithParenWithType -> %lparen _ arglistWithType:* _ %rparen
{% d => ({ type: "argsWithParenWithType", args: d[2]}) %}
arglistWithType -> param _ %divider _ paramType _ %comma:* _
{% d => ({ type: "arglistWithType", param: d[0], paramType: d[4]}) %}

param -> %identifier {% id %}
paramType -> %identifier {% id %}

pubdef -> "def" | %pubdef {% id %}

returnType -> %identifier {% id %}

methodBody -> shortMethodBody {% id %}
    | longMethodBody {% id %}

# = $FLOAT32_ADD$(x, y)
shortMethodBody -> %identifier argsWithParen
{% d => ({ type: "shortMethodBody", name: d[0], args: d[1]}) %}

longMethodBody -> %identifier

# (x, y)
argsWithParen -> %lparen _ arglist:* _ %rparen
{% d => ({ type: "argsWithParen", args: d[2]}) %}
arglist -> param _ %comma:* _
{% d => ({ type: "arglist", param: d[0]}) %}

_ -> %space:*
__ -> %space:+ 



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
