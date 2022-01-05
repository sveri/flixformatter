/* eslint-disable @typescript-eslint/naming-convention */
import * as nearley from "nearley";
import { default as myGrammar } from "../grammar";
import { parseInstance } from "./instance.parser";
import { parseClass } from "./class.parser";
import { FlixMethodParser } from "./method.parser";

import {
  createToken,
  Lexer,
  CstParser,
  EmbeddedActionsParser,
} from "chevrotain";

import * as T from './token';


const flixLexer = new Lexer(T.allTokens);


// Embedded Actions
class FlixParser extends EmbeddedActionsParser {
  tabSize = 4;
  indentationLevel;
  
  constructor() {
    super(T.allTokens);
    this.indentationLevel = 0;
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
          { ALT: () => result += this.SUBRULE(this.singleLineComment)},
          { ALT: () => result += this.SUBRULE(this.multiLineComment)},
          { ALT: () => result += this.SUBRULE(this.instance)},
          { ALT: () => result += this.SUBRULE(this.clazz)},
          // { ALT: () => result += this.SUBRULE(this.javaImport)},
        ]);
      },
    });

    return result;
  });

  private singleLineComment = this.RULE("singleLineComment", () => {
    const r = this.CONSUME(T.SingleComment);
    return this.getIndentation() + r.image;
  });

  private multiLineComment = this.RULE("multiLineComment", () => {
    const r = this.CONSUME(T.MultiLineComment);
    return r.image;
  });

  private clazz = this.RULE("clazz", () => {
    let className = this.SUBRULE(this.clazzNameWithModifier);
    this.CONSUME(T.LCurly);
    this.indentationLevel++;
    let classBody = this.SUBRULE(this.instanceOrClassBody);
    this.indentationLevel--;
    this.CONSUME(T.RCurly);
    return className +  "{\n" + classBody + "}\n\n";
  });

  // pub lawless class Foo | lawless class Foo | pub class Foo | class Foo
  private clazzNameWithModifier = this.RULE("clazzNameWithModifier", () => {
    let pub = "", lawless = "", name = "";
    this.OR([
      {ALT:()=>{
        pub = this.CONSUME(T.Pub).image;
        lawless = this.CONSUME(T.Lawless).image;
        this.CONSUME(T.Class);
        name = this.CONSUME(T.Identifier).image;
      }},
      {ALT:()=>{
        lawless = this.CONSUME1(T.Lawless).image;
        this.CONSUME1(T.Class);
        name = this.CONSUME1(T.Identifier).image;
      }},
      {ALT:()=>{
        this.CONSUME2(T.Class);
        name = this.CONSUME2(T.Identifier).image;
      }},
      {ALT:()=>{
        pub = this.CONSUME1(T.Pub).image;
        this.CONSUME3(T.Class);
        name = this.CONSUME3(T.Identifier).image;
      }}
    ]);
    let type = this.SUBRULE(this.singleBracketWithType);
    return pub + " " + lawless + " class " + name + type + " ";;
  });

  private instance = this.RULE("instance", () => {
    this.CONSUME(T.Instance);
    let identifier = this.CONSUME(T.Identifier);
    let instanceType = this.SUBRULE(this.singleBracketWithType);
    this.CONSUME(T.LCurly);
    this.indentationLevel++;
    let instanceBody = this.SUBRULE(this.instanceOrClassBody);
    this.indentationLevel--;
    this.CONSUME(T.RCurly);
    return "instance " + identifier.image + instanceType + " {\n" + instanceBody + "}\n\n";
  });

  private instanceOrClassBody = this.RULE("instanceOrClassBody", () => {
    let result = "";
    
    this.MANY({
      DEF: () => {
        this.OR([
          { ALT: () => result += this.SUBRULE(this.method)},      
          { ALT: () => result += this.SUBRULE(this.singleLineComment)},
          { ALT: () => result += this.SUBRULE(this.multiLineComment)},
        ]);
      },
    });
    return result;
  });

  public method = this.RULE("method", () => {
    const pubDef = this.CONSUME(T.PubDef);
    const methodName = this.CONSUME(T.Identifier);

    let argumentsWithType: any[] = [];
    this.CONSUME(T.LParen);
    this.MANY_SEP({
      SEP: T.Comma, DEF: () => {
        argumentsWithType.push(this.SUBRULE(this.argumentsWithType));
      }
    });
    this.CONSUME(T.RParen);
    let returnType = this.SUBRULE(this.methodReturnType);
    // this.CONSUME(T.Assignment);
    // let methodBody = this.SUBRULE(this.methodBody);
    let assignment;
    let methodBody = "";
    this.OPTION(() => {assignment = this.CONSUME(T.Assignment);});
    this.OPTION1(() => {methodBody = this.methodBody();});

    if(assignment ===  undefined) {
      assignment = "";
    } else {
      assignment = " =";
    }

    return this.getIndentation() + pubDef.image + " " + methodName.image + "(" + argumentsWithType.join(", ") + ")"
      + returnType + assignment + "\n" + methodBody;
  });

  private methodReturnType = this.RULE("methodReturnType", () => {
    this.CONSUME(T.Colon);
    let type = this.SUBRULE(this.oneOfTheTypes);
    return ": " + type;
  });

  private methodBody = this.RULE("methodBody", () => {
    let result = "";
    this.indentationLevel++;
    this.MANY({
      DEF: () => {
        this.OR([
          { ALT: () => result += this.SUBRULE(this.referenceMethodCall)},
          { ALT: () => result += this.SUBRULE(this.javaImport)},
          { ALT: () => result += this.SUBRULE(this.completeJavaMethodCallWithType)},
        ]);
      },
    });
    this.indentationLevel--;

    return result;
  });

  // (x \`concat\` y) as & Pure
  private completeJavaMethodCallWithType = this.RULE("completeJavaMethodCallWithType", () => {
    this.CONSUME(T.LParen);
    let lhs = this.SUBRULE(this.lhsOfJavaMethodCall);
    let method = this.CONSUME(T.JavaMethodCall);
    let rhs = this.SUBRULE(this.rhsOfJavaMethodCall);
    this.CONSUME(T.RParen);
    
    this.CONSUME(T.As);
    
    this.CONSUME(T.Ampersand);
    
    let type = this.SUBRULE(this.oneOfTheTypes);

    // return call.image + "(" + callIdentifier.join(", ") + ")";
    return this.getIndentation() + "(" + lhs + " " + method.image + " " + 
      rhs + ") as & " + type + "\n";
  });

  private lhsOfJavaMethodCall = this.RULE("lhsOfJavaMethodCall", () => {
    let imports = this.CONSUME(T.Identifier);
    return imports.image;
  });

  private rhsOfJavaMethodCall = this.RULE("rhsOfJavaMethodCall", () => {
    let imports = this.CONSUME(T.Identifier);
    return imports.image;
  });

  private javaImport = this.RULE("javaImport", () => {
    let imports = this.CONSUME(T.JavaImport);

    return this.getIndentation() + imports.image + "\n";
  });

  // $FLOAT32_ADD$(x, y)
  private referenceMethodCall = this.RULE("referenceMethodCall", () => {
    let call = this.CONSUME(T.ReferenceMethodCall);

    let argumentsWithoutType: any[] = [];
    this.CONSUME(T.LParen);
    this.MANY_SEP({
      SEP: T.Comma, DEF: () => {
        argumentsWithoutType.push(this.SUBRULE(this.argumentsWithouthType));
      }
    });
    this.CONSUME(T.RParen);

    return this.getIndentation() + call.image + "(" + argumentsWithoutType.join(", ") + ")\n";
  });

  // (x: Float32, y: Float32)
  private argumentsWithType = this.RULE("argumentsWithType", () => {
    let param = this.CONSUME(T.Identifier);
    this.CONSUME(T.Colon);
    let paramType = this.SUBRULE(this.oneOfTheTypes);
    return param.image + ": " + paramType;
  });

  // (x, y)
  private argumentsWithouthType = this.RULE("argumentsWithouthType", () => {
    let param = this.CONSUME(T.Identifier);
    return param.image;
  });

  //[String]
  private singleBracketWithType = this.RULE("singleBracketType", () => {
    this.CONSUME(T.LSquare);
    let instanceType = this.SUBRULE(this.oneOfTheTypes);
    this.CONSUME(T.RSquare);
    return "[" + instanceType + "]";
  });

  private oneOfTheTypes = this.RULE("oneOfTheTypes", () => {
    let typeResult = this.OR([
      { ALT: () => this.CONSUME(T.TypePure)},
      { ALT: () => this.CONSUME(T.TypeString)},
      { ALT: () => this.CONSUME(T.TypeFloat32)},
      { ALT: () => this.CONSUME(T.TypeFloat64)},
      { ALT: () => this.CONSUME(T.TypeInt8)},
      { ALT: () => this.CONSUME(T.TypeInt16)},
      { ALT: () => this.CONSUME(T.TypeInt32)},
      { ALT: () => this.CONSUME(T.TypeInt64)},
      { ALT: () => this.CONSUME(T.TypeBigInt)},
      { ALT: () => this.CONSUME(T.Identifier)},
    ]);
    return typeResult.image;
  });
}


export function parse(s: string, tabSize: number) {
  const parser = new FlixParser();

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