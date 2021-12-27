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
    pub: 'pub',
    lawless: 'lawless',
    identifier: /[\w.$.*]+/
});
%}

# Pass your lexer object using the @lexer option:
@lexer lexer

main -> (expression | comment):* {% d => {return ({ type: "main", body: d[0]})} %}

comment -> %comment _ {% id %}

expression -> instance {% id %}
    | class {% id %}

# instance Add[Float32] {
instance -> "instance" __ %identifier %lbracket %identifier %rbracket _ %lbrace _ instanceBody  %rbrace _
{% d => {return { type: "instance", name: d[2], instanceTypeInfo: d[4], body: d[9]}} %}

instanceBody -> method {% id %}

# class
class -> %pub __ (%lawless __):* "class" __  %identifier %lbracket %identifier %rbracket __ %lbrace _ classBody _ %rbrace
{% d => {return { type: "class", name: d[5], classTypeInfo: d[7], body: d[12]}} %}

classBody -> (comment | method):*

method -> pubdef __ %identifier _ argsWithParenWithType _ %divider _ returnType _ %assignement _ methodBody _ 
    {% d => {return { type: "method", pubdef: d[0], name: d[2], args: d[4], returnType: d[8], body: d[12]}} %}    
    # | pubdef __ %identifier _ argsWithParenWithType _ %divider _ returnType

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
# _ -> %WS:*
# __ -> %WS:+ 

# main ->
#     %comment %newline:* {% d => {console.log("comment: " + JSON.stringify(d[0])); return ({ type: "element", data: d[0]})} %}
#   | main %newline %comment %newline:* {% d => {console.log("main elem: " + JSON.stringify(d)); return ({ type: "main_element", data: d})} %}

# main ->
#     element {% d => ({ type: "main_element", data: d}) %}
#   | main %newline element {% appendItem(0, 2) %}
#   | main %newline element {% d => ({ type: "main_element", data: d[2], main_data: d[0]}) %}


# element -> %comment %newline:*
# {% d => ({ type: "element", data: d[0]}) %}
# {% d => returnAllData("element", d) %}

# comment -> 
# {% d => ({ type: "comment", data: d[0]}) %}

# class -> ("pub" _) "class"
# class -> ("pub" _):? ("class" _)  %Identifier _ %lbrace _  %rbrace 
# {% d => ({ type: "class", name: d[2], content: d[5] }) %}

# # ifstatement -> %keyword %WS:* %lparen %WS:* %Identifier %WS:* %comparisonOperator %WS:* %Identifier %WS:*  %rparen {%
# ifstatement -> "if" %WS:* %lparen logicalstatement  %rparen {%
#     function(data) {
#         return {
#             type: "if",
#             leftBracket:  data[1],
#             statement: data[2],
#             rightBracket: data[3]
#         };
#     }
# %}

# logicalstatement -> %WS:* %Identifier %WS:* %comparisonOperator %WS:* %Identifier %WS:*{%
#     function(data) {
#         return {
#             leftOperand:  data[1],
#             operand: data[3],
#             rightOperand: data[5]
#         };
#     }
# %}


# LineEnd -> null {% nullify %}
#           | [^\n] LineEnd {% nullify %}

# Use %token to match any token of that type instead of "token":
#multiplication -> %number %ws %times %ws %number {% ([first, , , , second]) => first * second %}

# Literal strings now match tokens with that text:
#trig -> "sin" %number