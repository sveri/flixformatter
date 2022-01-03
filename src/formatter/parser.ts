/* eslint-disable @typescript-eslint/naming-convention */
import * as nearley from "nearley";
import { default as myGrammar } from "../grammar";
import { parseInstance } from "./instance.parser";
import { parseClass } from "./class.parser";

import {
  createToken,
  Lexer,
  CstParser,
  EmbeddedActionsParser,
} from "chevrotain";
import { resourceLimits } from "worker_threads";

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
const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z]\w*/ });

const SingleComment = createToken({
  name: "SingleComment",
  pattern: /\/\/[^\n\r]*?(?:\*\)|[\r\n|\n])/,
  // pattern: /\/\/(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*\n|\r/
  // pattern: /\/\/(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*\n\r/
});

const MultiLineComment = createToken({
  name: "MultiLineComment",
  pattern: /\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/[\n]*/,
  // pattern: /\/\/(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*\n|\r/
  // pattern: /\/\/(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*\n\r/
});

// $FLOAT32_ADD$
const ReferenceMethodCall = createToken({
  name: "ReferenceMethodCall",
  pattern: /\$(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*\$/,
});

const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

const allTokens = [
  WhiteSpace,
  SingleComment,
  MultiLineComment,
  Instance,
  PubDef,
  Pub,
  LParen,
  RParen,
  LCurly,
  RCurly,
  LSquare,
  RSquare,
  Comma,
  Colon,
  Assignment,
  ReferenceMethodCall,

  Identifier,
];
const flixLexer = new Lexer(allTokens);


// Embedded Actions
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
    this.MANY({
      DEF: () => {
        this.OR([
          { ALT: () => result += this.SUBRULE(this.singleLineComment) },
          { ALT: () => result += this.SUBRULE(this.multiLineComment) },
          { ALT: () => result += this.SUBRULE(this.instance) },
        ]);
      },
    });
    // this.OR([
    //   { ALT: () => result += this.SUBRULE(this.singleLineComment) },
    //   { ALT: () => result += this.SUBRULE(this.instance) },
    // ]);

    return result;
  });

  private singleLineComment = this.RULE("singleLineComment", () => {
    const r = this.CONSUME(SingleComment);
    return r.image;
  });

  private multiLineComment = this.RULE("multiLineComment", () => {
    const r = this.CONSUME(MultiLineComment);
    return r.image;
  });

  private instance = this.RULE("instance", () => {
    this.CONSUME(Instance);
    let identifier = this.CONSUME(Identifier);
    let instanceType = this.SUBRULE(this.singleBracketWithType);
    this.CONSUME(LCurly);
    this.indentationLevel++;
    let instanceBody = this.SUBRULE(this.instanceBody);
    this.indentationLevel--;
    this.CONSUME(RCurly);
    return "instance " + identifier.image + instanceType + " {\n" + instanceBody + "\n}asfsadf";
  });

  private instanceBody = this.RULE("instanceBody", () => {
    let result = "";
    this.OR([
      { ALT: () => result +=  this.SUBRULE(this.method) },
    ]);

    return result;
  });

  private method = this.RULE("method", () => {
    const pubDef = this.CONSUME(PubDef);
    const methodName = this.CONSUME(Identifier);

    let argumentsWithType: any[] = [];
    this.CONSUME(LParen);
    this.MANY_SEP({
      SEP: Comma, DEF: () => {
        argumentsWithType.push(this.SUBRULE(this.argumentsWithType));
      }
    });
    this.CONSUME(RParen);
    let returnType = this.SUBRULE(this.methodReturnType);
    this.CONSUME(Assignment);
    let methodBody = this.SUBRULE(this.methodBody);

    return this.getIndentation() + "-----------------------------" + pubDef.image + " " + methodName.image + "(" + argumentsWithType.join(", ") + ")"
      + returnType + " = " + methodBody;
  });

  private type = this.RULE("type", () => {
    let type = this.CONSUME(Identifier);
    return type.image;
  });

  private methodReturnType = this.RULE("methodReturnType", () => {
    this.CONSUME(Colon);
    let type = this.CONSUME(Identifier);
    return ": " + type.image;
  });

  private methodBody = this.RULE("methodBody", () => {
    let result = "";
    this.OR([
      { ALT: () => result += this.SUBRULE(this.referenceMethodCall) },
    ]);

    return result;
  });

  // $FLOAT32_ADD$(x, y)
  private referenceMethodCall = this.RULE("referenceMethodCall", () => {
    let call = this.CONSUME(ReferenceMethodCall);

    let argumentsWithoutType: any[] = [];
    this.CONSUME(LParen);
    this.MANY_SEP({
      SEP: Comma, DEF: () => {
        argumentsWithoutType.push(this.SUBRULE(this.argumentsWithouthType));
      }
    });
    this.CONSUME(RParen);

    return call.image + "(" + argumentsWithoutType.join(", ") + ")";
  });

  // (x: Float32, y: Float32)
  private argumentsWithType = this.RULE("argumentsWithType", () => {
    let param = this.CONSUME(Identifier);
    this.CONSUME(Colon);
    let paramType = this.SUBRULE(this.type);
    return param.image + ": " + paramType;
  });

  // (x, y)
  private argumentsWithouthType = this.RULE("argumentsWithouthType", () => {
    let param = this.CONSUME(Identifier);
    return param.image;
  });

  private singleBracketWithType = this.RULE("singleBracketType", () => {
    this.CONSUME(LSquare);
    let instanceType = this.CONSUME(Identifier);
    this.CONSUME(RSquare);
    return "[" + instanceType.image + "]";
  });
}

const parser = new FlixParser();

export function parse(s: string, tabSize: number) {

  const lexResult = flixLexer.tokenize(s);

  if (lexResult.errors !== undefined && lexResult.errors.length > 0) {
    console.log("lexer errors: " + JSON.stringify(lexResult.errors));
  }

  parser.input = lexResult.tokens;
  if (parser.errors !== undefined && parser.errors.length > 0) {
    console.log("parser errors: " + JSON.stringify(parser.errors));
  }

  let parsedResult = parser.flix().trim();
  console.log("parsedResult: " + JSON.stringify(parsedResult));

  return parsedResult;
}











// CST
// class FlixParser extends CstParser {
//   tabSize = 4;
//   indentationLevel = 0;

//   constructor() {
//     super(allTokens);
//     this.performSelfAnalysis();
//   }

//   private getIndentation() {
//     return " ".repeat(this.tabSize * this.indentationLevel);
//   }

//   public flix = this.RULE("file", () => {
//     this.MANY({
//       DEF: () => {
//         this.OR([
//           { ALT: () => this.SUBRULE(this.singleLineComment) },
//           { ALT: () => this.SUBRULE(this.multiLineComment) },
//           // { ALT: () => this.SUBRULE(this.instance) },
//         ]);
//       },
//     });
//     // this.OR([
//     //   { ALT: () => this.SUBRULE(this.singleLineComment) },
//     //   { ALT: () => this.SUBRULE(this.instance) },
//     // ]);
//   });

//   private singleLineComment = this.RULE("singleLineComment", () => {
//     this.CONSUME(SingleComment);
//   });
//   private multiLineComment = this.RULE("multiLineComment", () => {
//     this.CONSUME(MultiLineComment);
//   });

//   // private instance = this.RULE("instance", () => {
//   //   this.CONSUME(Instance);
//   //   this.CONSUME(Identifier);
//   //   this.SUBRULE(this.singleBracketWithType);
//   //   this.CONSUME(LCurly);
//   //   this.SUBRULE(this.instanceBody);
//   //   this.CONSUME(RCurly);
//   // });

//   // private instanceBody = this.RULE("instanceBody", () => {
//   //   this.OR([
//   //     { ALT: () =>  this.SUBRULE(this.method) },
//   //   ]);
//   // });

//   // private method = this.RULE("method", () => {
//   //   this.CONSUME(PubDef);
//   //   this.CONSUME(Identifier);

//   //   this.CONSUME(LParen);
//   //   this.MANY_SEP({
//   //     SEP: Comma, DEF: () => {
//   //       this.SUBRULE(this.argumentsWithType);
//   //     }
//   //   });
//   //   this.CONSUME(RParen);
//   //   this.SUBRULE(this.methodReturnType);
//   //   this.CONSUME(Assignment);
//   //   this.SUBRULE(this.methodBody);
//   // });

//   // private type = this.RULE("type", () => {
//   //   this.CONSUME(Identifier);
//   // });

//   // private methodReturnType = this.RULE("methodReturnType", () => {
//   //   this.CONSUME(Colon);
//   //   this.CONSUME(Identifier);
//   // });

//   // private methodBody = this.RULE("methodBody", () => {
//   //   this.OR([
//   //     { ALT: () => this.SUBRULE(this.referenceMethodCall) },
//   //   ]);
//   // });

//   // // $FLOAT32_ADD$(x, y)
//   // private referenceMethodCall = this.RULE("referenceMethodCall", () => {
//   //   this.CONSUME(ReferenceMethodCall);

//   //   this.CONSUME(LParen);
//   //   this.MANY_SEP({
//   //     SEP: Comma, DEF: () => {
//   //       this.SUBRULE(this.argumentsWithoutType);
//   //     }
//   //   });
//   //   this.CONSUME(RParen);
//   // });

//   // // (x: Float32, y: Float32)
//   // private argumentsWithType = this.RULE("argumentsWithType", () => {
//   //   this.CONSUME(Identifier);
//   //   this.CONSUME(Colon);
//   //   this.SUBRULE(this.type);
//   // });

//   // // (x, y)
//   // private argumentsWithoutType = this.RULE("argumentsWithoutType", () => {
//   //   this.CONSUME(Identifier);
//   // });

//   // private singleBracketWithType = this.RULE("singleBracketType", () => {
//   //   this.CONSUME(LSquare);
//   //   this.CONSUME(Identifier);
//   //   this.CONSUME(RSquare);
//   // });
// }

// const parser = new FlixParser();

// const BaseVisitor = parser.getBaseCstVisitorConstructor();

// // This BaseVisitor include default visit methods that simply traverse the CST.
// const BaseVisitorWithDefaults =
//   parser.getBaseCstVisitorConstructorWithDefaults();

// class CustomVisitor extends BaseVisitorWithDefaults {
//   constructor() {
//     super();
//     // The "validateVisitor" method is a helper utility which performs static analysis
//     // to detect missing or redundant visitor methods
//     this.validateVisitor();
//   }

//   iterateAndVisit(possibleArray: [any] | undefined): string {
//     let result = "";
//     if (possibleArray !== undefined) {
//       for (let e of possibleArray) {
//         result += this.visit(e);
//       }
//     }
//     return result;
//   }

//   file(ctx: any) {
//     console.log("file: " + JSON.stringify(ctx));
//     let result = "";

//     // for (let comment of ctx.singleLineComment) {
//     //   result += this.visit(comment);
//     // }
//     result += this.iterateAndVisit(ctx.singleLineComment) + "\n";
//     result += this.iterateAndVisit(ctx.multiLineComment) + "\n";

//     // ctx.singleLineComment.forEach(comment: any => {
//     //   this.visit(comment);
//     // });
//     // let singleLineComment = this.visit(ctx.singleLineComment);
//     // const tableName = ctx.Identifier[0].image;

//     return result;
//   }

//   singleLineComment(ctx: any) {
//     console.log("singleLineComment: " + JSON.stringify(ctx));
//     return ctx.SingleComment[0].image;
//   }

//   multiLineComment(ctx: any) {
//     console.log("multiLineComment: " + JSON.stringify(ctx));
//     return ctx.MultiLineComment[0].image;
//   }

//   // instance(ctx: any) {
//   //   return "";
//   // }

//   // instanceBody(ctx: any) {
//   //   return "";
//   // }

//   // method(ctx: any) {
//   //   return "";
//   // }

//   // type(ctx: any) {
//   //   return "";
//   // }

//   // methodReturnType(ctx: any) {
//   //   return "";
//   // }

//   // methodBody(ctx: any) {
//   //   return "";
//   // }

//   // referenceMethodCall(ctx: any) {
//   //   return "";
//   // }

//   // argumentsWithType(ctx: any) {
//   //   return "";
//   // }

//   // argumentsWithoutType(ctx: any) {
//   //   return "";
//   // }

//   // singleBracketType(ctx: any) {
//   //   return "";
//   // }
// }

// // class CustomVisitorWithDefaults extends BaseVisitorWithDefaults {
// //   constructor() {
// //     super();
// //     this.validateVisitor();
// //   }

// //   /* Visit methods go here */
// // }

// const myVisitorInstance = new CustomVisitor();
// // const myVisitorInstanceWithDefaults = new CustomVisitorWithDefaults();

// export function parse(s: string, tabSize: number) {
//   const lexResult = flixLexer.tokenize(s);
//   // setting a new input will RESET the parser instance's state.
//   parser.input = lexResult.tokens;
//   // any top level rule may be used as an entry point
//   const cst = parser.flix();

//   // const toAstVisitorInstance = new CustomVisitor();

//   const result = myVisitorInstance.visit(cst).trim();

//   console.log("parsedResult: " + JSON.stringify(result));
//   // this would be a TypeScript compilation error because our parser now has a clear API.
//   // let value = parser.json_OopsTypo()

//   // let res = {
//   //   cst: cst,
//   //   lexErrors: lexResult.errors,
//   //   parseErrors: parser.errors
//   // };

//   return result;

//   // const lexResult = jsonLexer.tokenize(s);

//   // if (lexResult.errors !== undefined && lexResult.errors.length > 0) {
//   //   console.log("lexer errors: " + JSON.stringify(lexResult.errors));
//   // }

//   // parser.input = lexResult.tokens;
//   // if (parser.errors !== undefined && parser.errors.length > 0) {
//   //   console.log("parser errors: " + JSON.stringify(parser.errors));
//   // }

//   // let parsedResult = parser.flix();

//   // return parsedResult;
// }