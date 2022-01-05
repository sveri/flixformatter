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
export const Instance = createToken({ name: "Instance", pattern: /instance/ });
export const PubDef = createToken({ name: "PubDef", pattern: /pub def/ });
export const Pub = createToken({ name: "Pub", pattern: /pub / });
export const As = createToken({ name: "As", pattern: /as/ });
export const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z]\w*/ });

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

// $FLOAT32_ADD$
export const ReferenceMethodCall = createToken({
  name: "ReferenceMethodCall",
  pattern: /\$([^\$]*)\$/,
  // pattern: /\$(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*\$/,
});

// `concat`
export const JavaMethodCall = createToken({
  name: "JavaMethodCall",
  pattern: /`([^`]*)`/,
});

// import java.lang.String.concat(String);
export const JavaImport = createToken({
  name: "JavaImport",
  pattern: /import ([^;]*);/,
});

export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const allTokens = [
  WhiteSpace,
  SingleComment,
  MultiLineComment,
  Instance,
  PubDef, Pub, As,
  LParen, RParen,
  LCurly, RCurly,
  LSquare, RSquare,
  Comma, Colon,
  Assignment, Ampersand,
  ReferenceMethodCall,
  JavaMethodCall, JavaImport,

  TypePure, TypeString,
  TypeFloat32, TypeFloat64,
  TypeInt8, TypeInt16, TypeInt32, TypeInt64, TypeBigInt,

  Identifier,
];