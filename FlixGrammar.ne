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
    identifier: /[\w.$.*]+/
});
%}

# Pass your lexer object using the @lexer option:
@lexer lexer

# main -> (expression | comment):* {% d => {console.log("main: " + JSON.stringify(d)); return d]} %}
# main -> (expression | comment):* {% d => {console.log("main: " + JSON.stringify(d)); return ({ type: "main", body: d[0]})} %}
main -> (expression | comment):* {% d => {return ({ type: "main", body: d[0]})} %}

# comment -> %comment %NL {% d => {console.log("comment: " + JSON.stringify(d[0])); return d[0]} %}
comment -> %comment %NL {% id %}

expression -> instance

# comment -> %comment {% d => {console.log("comment: " + JSON.stringify(d[0])); return ({ type: "comment", data: d[0]})} %}

instance -> "instance" _ %identifier %lbracket %identifier %rbracket _ %lbrace _ instanceBody  %rbrace %NL:* 
{% d => {return { type: "instance", name: d[2], instanceTypeInfo: [4], body: d[5]}} %}
# {% id %}
# {% d => {console.log("instance: " + JSON.stringify(d[0])); return { type: "instance", name: d[2], body: d[5]}} %}

instanceBody -> method

method -> pubdef __ %identifier _ argsWithParenWithType _ %divider _ returnType _ %assignement _ methodBody _

# (x: Float32, y: Float32)
argsWithParenWithType -> %lparen _ arglistWithType:* _ %rparen
arglistWithType -> param _ %divider _ paramType _ %comma:* _

param -> %identifier
paramType -> %identifier

pubdef -> "def" | %pubdef

returnType -> %identifier

methodBody -> %identifier argsWithParen

# (x, y)
argsWithParen -> %lparen _ arglist:* _ %rparen
arglist -> param _ %comma:* _

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