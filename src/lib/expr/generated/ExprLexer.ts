/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import * as antlr from "antlr4ng"

export class ExprLexer extends antlr.Lexer {
  public static readonly STRING = 1
  public static readonly TEXT = 2
  public static readonly XPSTART = 3
  public static readonly LEGACY_XPSTART = 4
  public static readonly WS = 5
  public static readonly XPEND = 6
  public static readonly PIPE = 7
  public static readonly COMMA = 8
  public static readonly LPAREN = 9
  public static readonly RPAREN = 10
  public static readonly DOT = 11
  public static readonly ID = 12
  public static readonly BooleanLiteral = 13
  public static readonly IntegerLiteral = 14
  public static readonly LEGACY_COLON = 15
  public static readonly LEGACY_DOT = 16
  public static readonly LEGACY_ID = 17
  public static readonly LegacyIntegerLiteral = 18
  public static readonly LEGACY_EXPR_XPEND = 19
  public static readonly LegacyPlaceHolderModifierDate = 20
  public static readonly LegacyPlaceholderModifierFormat = 21
  public static readonly LegacyPlaceholderModifierJoin = 22
  public static readonly LegacyPlaceHolderModifierOffsetFormat = 23
  public static readonly LEGACY_ARGS_COLON = 24
  public static readonly LEGACY_PLACEHOLDER_XPEND = 25
  public static readonly LEGACY_ARGS_XPEND = 26
  public static readonly LegacyPlaceholderArgs = 27
  public static readonly EXPR_MODE = 1
  public static readonly LEGACY_EXPR_MODE = 2
  public static readonly LEGACY_PLACEHOLDER_MODE = 3
  public static readonly LEGACY_ARGS_MODE = 4

  public static readonly channelNames = ["DEFAULT_TOKEN_CHANNEL", "HIDDEN"]

  public static readonly literalNames = [
    null,
    null,
    null,
    "'{{'",
    "'${'",
    null,
    "'}}'",
    null,
    "','",
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    "'date'",
    "'format'",
    "'join'",
    "'offset-format'",
  ]

  public static readonly symbolicNames = [
    null,
    "STRING",
    "TEXT",
    "XPSTART",
    "LEGACY_XPSTART",
    "WS",
    "XPEND",
    "PIPE",
    "COMMA",
    "LPAREN",
    "RPAREN",
    "DOT",
    "ID",
    "BooleanLiteral",
    "IntegerLiteral",
    "LEGACY_COLON",
    "LEGACY_DOT",
    "LEGACY_ID",
    "LegacyIntegerLiteral",
    "LEGACY_EXPR_XPEND",
    "LegacyPlaceHolderModifierDate",
    "LegacyPlaceholderModifierFormat",
    "LegacyPlaceholderModifierJoin",
    "LegacyPlaceHolderModifierOffsetFormat",
    "LEGACY_ARGS_COLON",
    "LEGACY_PLACEHOLDER_XPEND",
    "LEGACY_ARGS_XPEND",
    "LegacyPlaceholderArgs",
  ]

  public static readonly modeNames = [
    "DEFAULT_MODE",
    "EXPR_MODE",
    "LEGACY_EXPR_MODE",
    "LEGACY_PLACEHOLDER_MODE",
    "LEGACY_ARGS_MODE",
  ]

  public static readonly ruleNames = [
    "TEXT",
    "XPSTART",
    "LEGACY_XPSTART",
    "WS",
    "XPEND",
    "PIPE",
    "COMMA",
    "LPAREN",
    "RPAREN",
    "DOT",
    "ID",
    "BooleanLiteral",
    "IntegerLiteral",
    "StringLiteral",
    "LEGACY_COLON",
    "LEGACY_DOT",
    "LEGACY_ID",
    "LegacyIntegerLiteral",
    "LEGACY_EXPR_XPEND",
    "LegacyPlaceHolderModifierDate",
    "LegacyPlaceholderModifierFormat",
    "LegacyPlaceholderModifierJoin",
    "LegacyPlaceHolderModifierOffsetFormat",
    "LEGACY_ARGS_COLON",
    "LEGACY_PLACEHOLDER_XPEND",
    "LEGACY_ARGS_XPEND",
    "LegacyPlaceholderArgs",
  ]

  public constructor(input: antlr.CharStream) {
    super(input)
    this.interpreter = new antlr.LexerATNSimulator(
      this,
      ExprLexer._ATN,
      ExprLexer.decisionsToDFA,
      new antlr.PredictionContextCache(),
    )
  }

  public get grammarFileName(): string {
    return "ExprLexer.g4"
  }

  public get literalNames(): (string | null)[] {
    return ExprLexer.literalNames
  }
  public get symbolicNames(): (string | null)[] {
    return ExprLexer.symbolicNames
  }
  public get ruleNames(): string[] {
    return ExprLexer.ruleNames
  }

  public get serializedATN(): number[] {
    return ExprLexer._serializedATN
  }

  public get channelNames(): string[] {
    return ExprLexer.channelNames
  }

  public get modeNames(): string[] {
    return ExprLexer.modeNames
  }

  public static readonly _serializedATN: number[] = [
    4, 0, 27, 266, 6, -1, 6, -1, 6, -1, 6, -1, 6, -1, 2, 0, 7, 0, 2, 1, 7, 1, 2,
    2, 7, 2, 2, 3, 7, 3, 2, 4, 7, 4, 2, 5, 7, 5, 2, 6, 7, 6, 2, 7, 7, 7, 2, 8,
    7, 8, 2, 9, 7, 9, 2, 10, 7, 10, 2, 11, 7, 11, 2, 12, 7, 12, 2, 13, 7, 13, 2,
    14, 7, 14, 2, 15, 7, 15, 2, 16, 7, 16, 2, 17, 7, 17, 2, 18, 7, 18, 2, 19, 7,
    19, 2, 20, 7, 20, 2, 21, 7, 21, 2, 22, 7, 22, 2, 23, 7, 23, 2, 24, 7, 24, 2,
    25, 7, 25, 2, 26, 7, 26, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 4, 0, 65, 8, 0, 11,
    0, 12, 0, 66, 1, 0, 1, 0, 1, 0, 1, 0, 3, 0, 73, 8, 0, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 3, 4, 3, 86, 8, 3, 11, 3, 12, 3,
    87, 1, 3, 1, 3, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 5, 5, 5, 98, 8, 5, 10, 5,
    12, 5, 101, 9, 5, 1, 5, 1, 5, 5, 5, 105, 8, 5, 10, 5, 12, 5, 108, 9, 5, 1,
    6, 1, 6, 1, 7, 5, 7, 113, 8, 7, 10, 7, 12, 7, 116, 9, 7, 1, 7, 1, 7, 5, 7,
    120, 8, 7, 10, 7, 12, 7, 123, 9, 7, 1, 8, 5, 8, 126, 8, 8, 10, 8, 12, 8,
    129, 9, 8, 1, 8, 1, 8, 5, 8, 133, 8, 8, 10, 8, 12, 8, 136, 9, 8, 1, 9, 1, 9,
    1, 10, 1, 10, 5, 10, 142, 8, 10, 10, 10, 12, 10, 145, 9, 10, 1, 11, 1, 11,
    1, 11, 1, 11, 1, 11, 1, 11, 1, 11, 1, 11, 1, 11, 3, 11, 156, 8, 11, 1, 12,
    1, 12, 1, 12, 5, 12, 161, 8, 12, 10, 12, 12, 12, 164, 9, 12, 3, 12, 166, 8,
    12, 1, 13, 1, 13, 1, 13, 1, 13, 5, 13, 172, 8, 13, 10, 13, 12, 13, 175, 9,
    13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 5, 13, 182, 8, 13, 10, 13, 12, 13,
    185, 9, 13, 1, 13, 3, 13, 188, 8, 13, 1, 13, 1, 13, 1, 14, 1, 14, 1, 14, 1,
    14, 1, 15, 1, 15, 1, 16, 1, 16, 5, 16, 200, 8, 16, 10, 16, 12, 16, 203, 9,
    16, 1, 17, 1, 17, 1, 17, 5, 17, 208, 8, 17, 10, 17, 12, 17, 211, 9, 17, 3,
    17, 213, 8, 17, 1, 18, 1, 18, 1, 18, 1, 18, 1, 19, 1, 19, 1, 19, 1, 19, 1,
    19, 1, 20, 1, 20, 1, 20, 1, 20, 1, 20, 1, 20, 1, 20, 1, 21, 1, 21, 1, 21, 1,
    21, 1, 21, 1, 22, 1, 22, 1, 22, 1, 22, 1, 22, 1, 22, 1, 22, 1, 22, 1, 22, 1,
    22, 1, 22, 1, 22, 1, 22, 1, 22, 1, 23, 1, 23, 1, 23, 1, 23, 1, 24, 1, 24, 1,
    24, 1, 24, 1, 25, 1, 25, 1, 25, 1, 25, 1, 26, 4, 26, 263, 8, 26, 11, 26, 12,
    26, 264, 2, 173, 183, 0, 27, 5, 2, 7, 3, 9, 4, 11, 5, 13, 6, 15, 7, 17, 8,
    19, 9, 21, 10, 23, 11, 25, 12, 27, 13, 29, 14, 31, 0, 33, 15, 35, 16, 37,
    17, 39, 18, 41, 19, 43, 20, 45, 21, 47, 22, 49, 23, 51, 24, 53, 25, 55, 26,
    57, 27, 5, 0, 1, 2, 3, 4, 11, 2, 0, 36, 36, 123, 123, 1, 0, 123, 123, 3, 0,
    9, 10, 13, 13, 32, 32, 1, 0, 97, 122, 4, 0, 48, 57, 65, 90, 95, 95, 97, 122,
    1, 0, 49, 57, 1, 0, 48, 57, 9, 0, 34, 34, 39, 39, 92, 92, 98, 98, 102, 102,
    110, 110, 114, 114, 116, 116, 118, 118, 4, 0, 10, 10, 13, 13, 34, 34, 92,
    92, 4, 0, 10, 10, 13, 13, 39, 39, 92, 92, 1, 0, 125, 125, 286, 0, 5, 1, 0,
    0, 0, 0, 7, 1, 0, 0, 0, 0, 9, 1, 0, 0, 0, 0, 11, 1, 0, 0, 0, 1, 13, 1, 0, 0,
    0, 1, 15, 1, 0, 0, 0, 1, 17, 1, 0, 0, 0, 1, 19, 1, 0, 0, 0, 1, 21, 1, 0, 0,
    0, 1, 23, 1, 0, 0, 0, 1, 25, 1, 0, 0, 0, 1, 27, 1, 0, 0, 0, 1, 29, 1, 0, 0,
    0, 1, 31, 1, 0, 0, 0, 2, 33, 1, 0, 0, 0, 2, 35, 1, 0, 0, 0, 2, 37, 1, 0, 0,
    0, 2, 39, 1, 0, 0, 0, 2, 41, 1, 0, 0, 0, 3, 43, 1, 0, 0, 0, 3, 45, 1, 0, 0,
    0, 3, 47, 1, 0, 0, 0, 3, 49, 1, 0, 0, 0, 3, 51, 1, 0, 0, 0, 3, 53, 1, 0, 0,
    0, 4, 55, 1, 0, 0, 0, 4, 57, 1, 0, 0, 0, 5, 72, 1, 0, 0, 0, 7, 74, 1, 0, 0,
    0, 9, 79, 1, 0, 0, 0, 11, 85, 1, 0, 0, 0, 13, 91, 1, 0, 0, 0, 15, 99, 1, 0,
    0, 0, 17, 109, 1, 0, 0, 0, 19, 114, 1, 0, 0, 0, 21, 127, 1, 0, 0, 0, 23,
    137, 1, 0, 0, 0, 25, 139, 1, 0, 0, 0, 27, 155, 1, 0, 0, 0, 29, 165, 1, 0, 0,
    0, 31, 187, 1, 0, 0, 0, 33, 191, 1, 0, 0, 0, 35, 195, 1, 0, 0, 0, 37, 197,
    1, 0, 0, 0, 39, 212, 1, 0, 0, 0, 41, 214, 1, 0, 0, 0, 43, 218, 1, 0, 0, 0,
    45, 223, 1, 0, 0, 0, 47, 230, 1, 0, 0, 0, 49, 235, 1, 0, 0, 0, 51, 249, 1,
    0, 0, 0, 53, 253, 1, 0, 0, 0, 55, 257, 1, 0, 0, 0, 57, 262, 1, 0, 0, 0, 59,
    65, 8, 0, 0, 0, 60, 61, 5, 123, 0, 0, 61, 65, 8, 1, 0, 0, 62, 63, 5, 36, 0,
    0, 63, 65, 8, 1, 0, 0, 64, 59, 1, 0, 0, 0, 64, 60, 1, 0, 0, 0, 64, 62, 1, 0,
    0, 0, 65, 66, 1, 0, 0, 0, 66, 64, 1, 0, 0, 0, 66, 67, 1, 0, 0, 0, 67, 73, 1,
    0, 0, 0, 68, 69, 5, 36, 0, 0, 69, 73, 5, 0, 0, 1, 70, 71, 5, 123, 0, 0, 71,
    73, 5, 0, 0, 1, 72, 64, 1, 0, 0, 0, 72, 68, 1, 0, 0, 0, 72, 70, 1, 0, 0, 0,
    73, 6, 1, 0, 0, 0, 74, 75, 5, 123, 0, 0, 75, 76, 5, 123, 0, 0, 76, 77, 1, 0,
    0, 0, 77, 78, 6, 1, 0, 0, 78, 8, 1, 0, 0, 0, 79, 80, 5, 36, 0, 0, 80, 81, 5,
    123, 0, 0, 81, 82, 1, 0, 0, 0, 82, 83, 6, 2, 1, 0, 83, 10, 1, 0, 0, 0, 84,
    86, 7, 2, 0, 0, 85, 84, 1, 0, 0, 0, 86, 87, 1, 0, 0, 0, 87, 85, 1, 0, 0, 0,
    87, 88, 1, 0, 0, 0, 88, 89, 1, 0, 0, 0, 89, 90, 6, 3, 2, 0, 90, 12, 1, 0, 0,
    0, 91, 92, 5, 125, 0, 0, 92, 93, 5, 125, 0, 0, 93, 94, 1, 0, 0, 0, 94, 95,
    6, 4, 3, 0, 95, 14, 1, 0, 0, 0, 96, 98, 3, 11, 3, 0, 97, 96, 1, 0, 0, 0, 98,
    101, 1, 0, 0, 0, 99, 97, 1, 0, 0, 0, 99, 100, 1, 0, 0, 0, 100, 102, 1, 0, 0,
    0, 101, 99, 1, 0, 0, 0, 102, 106, 5, 124, 0, 0, 103, 105, 3, 11, 3, 0, 104,
    103, 1, 0, 0, 0, 105, 108, 1, 0, 0, 0, 106, 104, 1, 0, 0, 0, 106, 107, 1, 0,
    0, 0, 107, 16, 1, 0, 0, 0, 108, 106, 1, 0, 0, 0, 109, 110, 5, 44, 0, 0, 110,
    18, 1, 0, 0, 0, 111, 113, 3, 11, 3, 0, 112, 111, 1, 0, 0, 0, 113, 116, 1, 0,
    0, 0, 114, 112, 1, 0, 0, 0, 114, 115, 1, 0, 0, 0, 115, 117, 1, 0, 0, 0, 116,
    114, 1, 0, 0, 0, 117, 121, 5, 40, 0, 0, 118, 120, 3, 11, 3, 0, 119, 118, 1,
    0, 0, 0, 120, 123, 1, 0, 0, 0, 121, 119, 1, 0, 0, 0, 121, 122, 1, 0, 0, 0,
    122, 20, 1, 0, 0, 0, 123, 121, 1, 0, 0, 0, 124, 126, 3, 11, 3, 0, 125, 124,
    1, 0, 0, 0, 126, 129, 1, 0, 0, 0, 127, 125, 1, 0, 0, 0, 127, 128, 1, 0, 0,
    0, 128, 130, 1, 0, 0, 0, 129, 127, 1, 0, 0, 0, 130, 134, 5, 41, 0, 0, 131,
    133, 3, 11, 3, 0, 132, 131, 1, 0, 0, 0, 133, 136, 1, 0, 0, 0, 134, 132, 1,
    0, 0, 0, 134, 135, 1, 0, 0, 0, 135, 22, 1, 0, 0, 0, 136, 134, 1, 0, 0, 0,
    137, 138, 5, 46, 0, 0, 138, 24, 1, 0, 0, 0, 139, 143, 7, 3, 0, 0, 140, 142,
    7, 4, 0, 0, 141, 140, 1, 0, 0, 0, 142, 145, 1, 0, 0, 0, 143, 141, 1, 0, 0,
    0, 143, 144, 1, 0, 0, 0, 144, 26, 1, 0, 0, 0, 145, 143, 1, 0, 0, 0, 146,
    147, 5, 116, 0, 0, 147, 148, 5, 114, 0, 0, 148, 149, 5, 117, 0, 0, 149, 156,
    5, 101, 0, 0, 150, 151, 5, 102, 0, 0, 151, 152, 5, 97, 0, 0, 152, 153, 5,
    108, 0, 0, 153, 154, 5, 115, 0, 0, 154, 156, 5, 101, 0, 0, 155, 146, 1, 0,
    0, 0, 155, 150, 1, 0, 0, 0, 156, 28, 1, 0, 0, 0, 157, 166, 5, 48, 0, 0, 158,
    162, 7, 5, 0, 0, 159, 161, 7, 6, 0, 0, 160, 159, 1, 0, 0, 0, 161, 164, 1, 0,
    0, 0, 162, 160, 1, 0, 0, 0, 162, 163, 1, 0, 0, 0, 163, 166, 1, 0, 0, 0, 164,
    162, 1, 0, 0, 0, 165, 157, 1, 0, 0, 0, 165, 158, 1, 0, 0, 0, 166, 30, 1, 0,
    0, 0, 167, 173, 5, 34, 0, 0, 168, 169, 5, 92, 0, 0, 169, 172, 7, 7, 0, 0,
    170, 172, 8, 8, 0, 0, 171, 168, 1, 0, 0, 0, 171, 170, 1, 0, 0, 0, 172, 175,
    1, 0, 0, 0, 173, 174, 1, 0, 0, 0, 173, 171, 1, 0, 0, 0, 174, 176, 1, 0, 0,
    0, 175, 173, 1, 0, 0, 0, 176, 188, 5, 34, 0, 0, 177, 183, 5, 39, 0, 0, 178,
    179, 5, 92, 0, 0, 179, 182, 7, 7, 0, 0, 180, 182, 8, 9, 0, 0, 181, 178, 1,
    0, 0, 0, 181, 180, 1, 0, 0, 0, 182, 185, 1, 0, 0, 0, 183, 184, 1, 0, 0, 0,
    183, 181, 1, 0, 0, 0, 184, 186, 1, 0, 0, 0, 185, 183, 1, 0, 0, 0, 186, 188,
    5, 39, 0, 0, 187, 167, 1, 0, 0, 0, 187, 177, 1, 0, 0, 0, 188, 189, 1, 0, 0,
    0, 189, 190, 6, 13, 4, 0, 190, 32, 1, 0, 0, 0, 191, 192, 5, 58, 0, 0, 192,
    193, 1, 0, 0, 0, 193, 194, 6, 14, 5, 0, 194, 34, 1, 0, 0, 0, 195, 196, 5,
    46, 0, 0, 196, 36, 1, 0, 0, 0, 197, 201, 7, 3, 0, 0, 198, 200, 7, 4, 0, 0,
    199, 198, 1, 0, 0, 0, 200, 203, 1, 0, 0, 0, 201, 199, 1, 0, 0, 0, 201, 202,
    1, 0, 0, 0, 202, 38, 1, 0, 0, 0, 203, 201, 1, 0, 0, 0, 204, 213, 5, 48, 0,
    0, 205, 209, 7, 5, 0, 0, 206, 208, 7, 6, 0, 0, 207, 206, 1, 0, 0, 0, 208,
    211, 1, 0, 0, 0, 209, 207, 1, 0, 0, 0, 209, 210, 1, 0, 0, 0, 210, 213, 1, 0,
    0, 0, 211, 209, 1, 0, 0, 0, 212, 204, 1, 0, 0, 0, 212, 205, 1, 0, 0, 0, 213,
    40, 1, 0, 0, 0, 214, 215, 5, 125, 0, 0, 215, 216, 1, 0, 0, 0, 216, 217, 6,
    18, 3, 0, 217, 42, 1, 0, 0, 0, 218, 219, 5, 100, 0, 0, 219, 220, 5, 97, 0,
    0, 220, 221, 5, 116, 0, 0, 221, 222, 5, 101, 0, 0, 222, 44, 1, 0, 0, 0, 223,
    224, 5, 102, 0, 0, 224, 225, 5, 111, 0, 0, 225, 226, 5, 114, 0, 0, 226, 227,
    5, 109, 0, 0, 227, 228, 5, 97, 0, 0, 228, 229, 5, 116, 0, 0, 229, 46, 1, 0,
    0, 0, 230, 231, 5, 106, 0, 0, 231, 232, 5, 111, 0, 0, 232, 233, 5, 105, 0,
    0, 233, 234, 5, 110, 0, 0, 234, 48, 1, 0, 0, 0, 235, 236, 5, 111, 0, 0, 236,
    237, 5, 102, 0, 0, 237, 238, 5, 102, 0, 0, 238, 239, 5, 115, 0, 0, 239, 240,
    5, 101, 0, 0, 240, 241, 5, 116, 0, 0, 241, 242, 5, 45, 0, 0, 242, 243, 5,
    102, 0, 0, 243, 244, 5, 111, 0, 0, 244, 245, 5, 114, 0, 0, 245, 246, 5, 109,
    0, 0, 246, 247, 5, 97, 0, 0, 247, 248, 5, 116, 0, 0, 248, 50, 1, 0, 0, 0,
    249, 250, 5, 58, 0, 0, 250, 251, 1, 0, 0, 0, 251, 252, 6, 23, 6, 0, 252, 52,
    1, 0, 0, 0, 253, 254, 5, 125, 0, 0, 254, 255, 1, 0, 0, 0, 255, 256, 6, 24,
    3, 0, 256, 54, 1, 0, 0, 0, 257, 258, 5, 125, 0, 0, 258, 259, 1, 0, 0, 0,
    259, 260, 6, 25, 3, 0, 260, 56, 1, 0, 0, 0, 261, 263, 8, 10, 0, 0, 262, 261,
    1, 0, 0, 0, 263, 264, 1, 0, 0, 0, 264, 262, 1, 0, 0, 0, 264, 265, 1, 0, 0,
    0, 265, 58, 1, 0, 0, 0, 28, 0, 1, 2, 3, 4, 64, 66, 72, 87, 99, 106, 114,
    121, 127, 134, 143, 155, 162, 165, 171, 173, 181, 183, 187, 201, 209, 212,
    264, 7, 2, 1, 0, 2, 2, 0, 6, 0, 0, 2, 0, 0, 7, 1, 0, 2, 3, 0, 2, 4, 0,
  ]

  private static __ATN: antlr.ATN
  public static get _ATN(): antlr.ATN {
    if (!ExprLexer.__ATN) {
      ExprLexer.__ATN = new antlr.ATNDeserializer().deserialize(
        ExprLexer._serializedATN,
      )
    }

    return ExprLexer.__ATN
  }

  private static readonly vocabulary = new antlr.Vocabulary(
    ExprLexer.literalNames,
    ExprLexer.symbolicNames,
    [],
  )

  public override get vocabulary(): antlr.Vocabulary {
    return ExprLexer.vocabulary
  }

  private static readonly decisionsToDFA = ExprLexer._ATN.decisionToState.map(
    (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index),
  )
}
