/* eslint-disable @typescript-eslint/naming-convention */

import {
    createToken,
    Lexer,
  } from "chevrotain";


export const TypePure = createToken({ name: "Pure", pattern: /Pure/ });
export const TypeString = createToken({ name: "TypeString", pattern: /String/ });
export const TypeFloat32 = createToken({ name: "Float32", pattern: /Float32/ });
export const TypeFloat64 = createToken({ name: "Float64", pattern: /Float64/ });
export const TypeInt8 = createToken({ name: "Int8", pattern: /Int8/ });
export const TypeInt16 = createToken({ name: "Int16", pattern: /Int16/ });
export const TypeInt32 = createToken({ name: "Int32", pattern: /Int32/ });
export const TypeInt64 = createToken({ name: "Int64", pattern: /Int64/ });
export const TypeBigInt = createToken({ name: "BigInt", pattern: /BigInt/ });
export const TypeApplication = createToken({ name: "TypeApplication", pattern: /->/ });

export const LParen = createToken({ name: "LParen", pattern: /\(/ });
export const RParen = createToken({ name: "RParen", pattern: /\)/ });
export const LCurly = createToken({ name: "LCurly", pattern: /{/ });
export const RCurly = createToken({ name: "RCurly", pattern: /}/ });
export const LSquare = createToken({ name: "LSquare", pattern: /\[/ });
export const RSquare = createToken({ name: "RSquare", pattern: /]/ });
export const Ampersand = createToken({ name: "Ampersand", pattern: /&/ });
export const Comma = createToken({ name: "Comma", pattern: /,/ });
export const Dot = createToken({ name: "Dot", pattern: /./ });
export const Colon = createToken({ name: "Colon", pattern: /:/ });
export const Assignment = createToken({ name: "Assignment", pattern: /=/ });
export const Instance = createToken({ name: "Instance", pattern: /instance/});
export const Lawless = createToken({ name: "Lawless", pattern: /lawless/});
export const Class = createToken({ name: "Class", pattern: /class/});
export const Functor = createToken({ name: "Functor", pattern: /Functor/});
export const PubDef = createToken({ name: "PubDef", pattern: /pub def/});
export const Pub = createToken({ name: "Pub", pattern: /pub/});
export const As = createToken({ name: "As", pattern: /as/});
export const With = createToken({ name: "With", pattern: /with/});
export const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z]\w*/ });

export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const BetweenParenthesis = createToken({
  name: "BetweenParenthesis",
  pattern: /\(([^)]+)\)/,
  // probably for nested brackets? (\[(?:\[??[^\[]*?\]))
});

export const BetweenBrackets = createToken({
  name: "BetweenBrackets",
  pattern: /\[([^\]]+)\]/,
});

export const SingleComment = createToken({
  name: "SingleComment",
  pattern: /\/\/[^\n\r]*?(?:\*\)|[\r\n|\n])/,
  // pattern: /\/\/[^\n\r]*?(?:\*\)|[\r\n|\n])/,
});

export const MultiLineComment = createToken({
  name: "MultiLineComment",
  pattern: /\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/[\n]*/,
  // pattern: /\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/[\n]*/,
});


// Add.foo.bar
// export const ArbitraryMethodCallWithoutParenthesis = createToken({
//   name: "ArbitraryMethodCallWithoutParenthesis",
//   pattern: /[\w]+\.[\w]+[\w\.]*/,
// });

// Applicative.ap(Functor.map(f, x1), x2)
export const ArbitraryMethodCallWithArguments = createToken({
  name: "ArbitraryMethodCallWithArguments",
  pattern: /\w+\.\w+[\w\.]*\([\w.\(, \)->]*\)/,
});

// $FLOAT32_ADD$
export const ReferenceMethodCall = createToken({
  name: "ReferenceMethodCall",
  pattern: /\$([^\$]*)\$/,
  // pattern: /\$(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*\$/,
});

// import java.lang.String.concat(String);
export const JavaImport = createToken({
  name: "JavaImport",
  pattern: /import ([^;]*);/,
});

// law identity: forall(x: m[a]) with Eq[m[a]] . Applicative.ap(Applicative.point(identity), x) ==
export const LawUntilWithEquals = createToken({
  name: "LawUntilWithEquals",
  pattern: /law [\w: \(\)\[\].,->]*==/,
});

export const allTokens = [
  WhiteSpace,
  SingleComment,
  MultiLineComment,

  JavaImport, LawUntilWithEquals,

  BetweenBrackets,
  BetweenParenthesis,

  TypeApplication,
  
  LParen, RParen,
  LCurly, RCurly,
  LSquare, RSquare,
  Comma, Colon,
  Assignment, Ampersand,
  
  PubDef, Pub, As,
  ReferenceMethodCall,
  Instance, Lawless, Class, With, Functor, 

  TypePure, TypeString,
  TypeFloat32, TypeFloat64,
  TypeInt8, TypeInt16, TypeInt32, TypeInt64, TypeBigInt,

  ArbitraryMethodCallWithArguments,

  Identifier,
];