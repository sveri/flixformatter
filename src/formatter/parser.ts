import * as nearley from 'nearley';
import { default as myGrammar } from '../grammar';
import { parseInstance } from './instance.parser';
import { parseClass } from './class.parser';

import { createToken, Lexer, CstParser, EmbeddedActionsParser  } from "chevrotain";
import { resourceLimits } from 'worker_threads';


// const singleComment = createToken({ name: "singleComment", pattern: /\/\// });
const lCurly = createToken({ name: "LCurly", pattern: /{/ });
const rCurly = createToken({ name: "RCurly", pattern: /}/ });
const lSquare = createToken({ name: "LSquare", pattern: /\[/ });
const rSquare = createToken({ name: "RSquare", pattern: /]/ });
const comma = createToken({ name: "Comma", pattern: /,/ });
const colon = createToken({ name: "Colon", pattern: /:/ });

const stringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/
});

const singleComment = createToken({
  name: "singleComment",
  pattern: /\/\/(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*\n|\r/
  // pattern: /\/\/(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*\n\r/
});
const numberLiteral = createToken({
  name: "NumberLiteral",
  pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
});
const newLine = createToken({
  name: "WhiteSpace",
  pattern: /[\n\r]+/,
  group: Lexer.SKIPPED
});
const whiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /[ \t]+/,
  group: Lexer.SKIPPED
});

const allTokens = [
  whiteSpace,
  singleComment,
  numberLiteral,
  stringLiteral,
  lCurly,
  rCurly,
  lSquare,
  rSquare,
  comma,
  colon,
];
const jsonLexer = new Lexer(allTokens);

// class FlixParser extends CstParser {
//     constructor() {
//       super(allTokens);
//       this.performSelfAnalysis();
//     }
//     public flix = this.RULE("file", () => {
//       this.OR([
//         { ALT: () => this.SUBRULE(this.singleLineComment) },
//       ]);
//     });
    
//       private singleLineComment = this.RULE("singleLineComment", () => {
//         this.CONSUME(singleComment);
//       });
// }

class FlixParser extends EmbeddedActionsParser  {
    constructor() {
      super(allTokens);
      this.performSelfAnalysis();
    }
    public flix = this.RULE("file", () => {
      let result = "";
      this.OR([
        { ALT: () => result += this.SUBRULE(this.singleLineComment) },
      ]);

      return result;
    });
    
      private singleLineComment = this.RULE("singleLineComment", () => {
        const r = this.CONSUME(singleComment);
        return r.image;
      });
}
  
  // reuse the same parser instance.
const parser = new FlixParser();

export function parse(s: string, tabSize: number) {

  const lexResult = jsonLexer.tokenize(s);
  // setting a new input will RESET the parser instance's state.
  parser.input = lexResult.tokens;
  // any top level rule may be used as an entry point
  return parser.flix().trim();
  // const cst = parser.flix();

  // // this would be a TypeScript compilation error because our parser now has a clear API.
  // // let value = parser.json_OopsTypo()
  
  // let result = {
  //   // This is a pure grammar, the value will be undefined until we add embedded actions
  //   // or enable automatic CST creation.
  //   cst: cst,
  //   lexErrors: lexResult.errors,
  //   parseErrors: parser.errors
  // };
  // console.log("parseResult: " + JSON.stringify(result));
  
  // return result;
}





// function parseResult(results: any, tabSize: number): string {
//     let resultString = "";
//     let indentationLevel = 0;

//     console.log("parseResult: " + JSON.stringify(results));
//     if (results.type === 'main') {

//         // for (const resultBodyArray of results.body as any) {
//         // console.log("results_array: " + JSON.stringify(resultBodyArray));
//         for (const bodyArray of results.body as any) {
//             // if (Array.isArray(body)) {
//                 // for (const bodyArray of body as any) {
//                     if (bodyArray.type === 'comment') {
//                         resultString += bodyArray.text + "\n";
//                     } else if ( bodyArray.type === 'multiLineComment') {
//                         resultString += "/*" + bodyArray.text + "*/\n";
//                     } else if (bodyArray.type === 'instance') {
//                         resultString += parseInstance(bodyArray, tabSize, indentationLevel) + "\n\n";
//                     } else if (bodyArray.type === 'class') {
//                         resultString += parseClass(bodyArray, tabSize, indentationLevel) + "\n\n";
//                     }
//                 // }
//             // }
//         }
//         // }
//     }

//     return resultString.trim();
// }




// export function parse(s: string, tabSize: number) {
    // console.log("toParse: " + JSON.stringify(s));
    // const parser = new nearley.Parser(nearley.Grammar.fromCompiled(myGrammar));
    // let parsedText = parser.feed(s).results;
    
    // // console.log("parsedText " + JSON.stringify(parsedText));

    // return parseResult(parsedText[0], tabSize);
// }
