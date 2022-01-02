/* eslint-disable @typescript-eslint/naming-convention */
import * as nearley from 'nearley';
import { default as myGrammar } from '../grammar';
import { parseInstance } from './instance.parser';
import { parseClass } from './class.parser';

import { createToken, Lexer, CstParser, EmbeddedActionsParser } from "chevrotain";
import { resourceLimits } from 'worker_threads';


// const singleComment = createToken({ name: "singleComment", pattern: /\/\// });
const LParen = createToken({ name: "LParen", pattern: /\(/ });
const RParen = createToken({ name: "RParen", pattern: /\)/ });
const LCurly = createToken({ name: "LCurly", pattern: /{/ });
const RCurly = createToken({ name: "RCurly", pattern: /}/ });
const LSquare = createToken({ name: "LSquare", pattern: /\[/ });
const RSquare = createToken({ name: "RSquare", pattern: /]/ });
const Comma = createToken({ name: "Comma", pattern: /,/ });
const Colon = createToken({ name: "Colon", pattern: /:/ });
const Assignment = createToken({ name: "Assignment", pattern: /=/ });
const Instance = createToken({ name: "Instance", pattern: /instance/ });
const PubDef = createToken({ name: "PubDef", pattern: /pub def/ });
const Pub = createToken({ name: "Pub", pattern: /pub / });
const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z$]\w*/ });


const SingleComment = createToken({
  name: "singleComment",
  pattern: /\/\/(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*\n|\r/
  // pattern: /\/\/(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*\n\r/
});

const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED
});


const allTokens = [
  WhiteSpace,
  SingleComment,
  Instance, PubDef, Pub,
  LParen, RParen,
  LCurly, RCurly,
  LSquare, RSquare,
  Comma, Colon,
  Assignment,

  Identifier,
];
const jsonLexer = new Lexer(allTokens);


class FlixParser extends EmbeddedActionsParser {
  tabSize = 4;
  indentationLevel = 0;

  constructor() {
    super(allTokens);
    this.performSelfAnalysis();
  }

  private getIndentation() {
    return " ".repeat(this.tabSize * this.indentationLevel);
  }

  public flix = this.RULE("file", () => {
    let result = "";
    this.OR([
      { ALT: () => result += this.SUBRULE(this.singleLineComment) },
      { ALT: () => result += this.SUBRULE(this.instace) },
    ]);
    
    return result;
  });
  
  private singleLineComment = this.RULE("singleLineComment", () => {
    const r = this.CONSUME(SingleComment);
    return r.image;
  });
  
  private instace = this.RULE("instance", () => {
    this.CONSUME(Instance);
    // this.CONSUME(WhiteSpace);
    let identifier = this.CONSUME(Identifier);
    let instanceType = this.SUBRULE(this.singleBracketWithType);
    this.CONSUME(LCurly);
    this.indentationLevel++;
    let instanceBody = this.SUBRULE(this.instanceBody);
    this.indentationLevel--;
    this.CONSUME(RCurly);
    return "instance " + identifier.image + instanceType + " {\n" + instanceBody + "\n}";
  });
  
  private instanceBody = this.RULE("instanceBody", () => {
    // let result = "";    
    // const pubDef = this.CONSUME(PubDef);
    
    // return pubDef.image;
    let result = "";
    this.OR([
      { ALT: () => result += this.SUBRULE(this.method)},
      // { ALT: () => result += this.SUBRULE(this.instace) },
    ]);
    
    return result;
  });
  
  private method = this.RULE("method", () => {
    let result = "";    
    const pubDef = this.CONSUME(PubDef);
    const methodName = this.CONSUME(Identifier);
    this.CONSUME(LParen);
    // let argumentsWithType = this.SUBRULE(this.argumentsWithType);
    this.CONSUME(RParen);

    // this.OR([
    //   { ALT: () => result += this.SUBRULE(this.singleLineComment) },
    //   { ALT: () => result += this.SUBRULE(this.instace) },
    // ]);
    
    return this.getIndentation() + pubDef.image + " " + methodName.image + "(" + ")";
    // return this.getIndentation() + pubDef.image + " " + methodName.image + "(" + argumentsWithType + ")";
  });
  
  // private argumentsWithType = this.RULE("argumentsWithType", () => {
  //   let param = this.CONSUME(Identifier);
  //   this.CONSUME(Colon);
  //   let paramType = this.CONSUME(Identifier);
  //   return param.image + ":" + paramType.image;
  // });
  
  private singleBracketWithType = this.RULE("singleBracketType", () => {
    this.CONSUME(LSquare);
    let instanceType = this.CONSUME(Identifier);
    this.CONSUME(RSquare);
    return "[" + instanceType.image + "]";
  });
}

const parser = new FlixParser();

export function parse(s: string, tabSize: number) {
  
  const lexResult = jsonLexer.tokenize(s);
  
  if(lexResult.errors !== undefined && lexResult.errors.length > 0) {
    console.log("lexer errors: " + JSON.stringify(lexResult.errors));
  }
  
  parser.input = lexResult.tokens;
  if(parser.errors !== undefined && parser.errors.length > 0) {
    console.log("parser errors: " + JSON.stringify(parser.errors));
  }
  
  let parsedResult = parser.flix();
  console.log("parsedResult: " + JSON.stringify(parsedResult));
  
  return parsedResult;
}



// const StringLiteral = createToken({
//   name: "StringLiteral",
//   pattern: /"(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/
// });
// const NumberLiteral = createToken({
//   name: "NumberLiteral",
//   pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
// });
// const NewLine = createToken({
//   name: "WhiteSpace",
//   pattern: /[\n\r]+/,
//   group: Lexer.SKIPPED
// });
// const whiteSpace = createToken({
//   name: "WhiteSpace",
//   pattern: /[ \t]+/,
//   group: Lexer.SKIPPED
// });