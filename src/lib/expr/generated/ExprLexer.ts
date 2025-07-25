/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import * as antlr from "antlr4ng"

export class ExprLexer extends antlr.Lexer {
  public static readonly STRING = 1
  public static readonly TEXT = 2
  public static readonly XPSTART = 3
  public static readonly LEGACY_XPSTART = 4
  public static readonly WS = 5
  public static readonly EXPR_WS = 6
  public static readonly XPEND = 7
  public static readonly PIPE = 8
  public static readonly COMMA = 9
  public static readonly LPAREN = 10
  public static readonly RPAREN = 11
  public static readonly DOT = 12
  public static readonly ID = 13
  public static readonly BooleanLiteral = 14
  public static readonly IntegerLiteral = 15
  public static readonly LEGACY_COLON = 16
  public static readonly LEGACY_DOT = 17
  public static readonly LEGACY_ID = 18
  public static readonly LegacyIntegerLiteral = 19
  public static readonly LEGACY_EXPR_XPEND = 20
  public static readonly LegacyPlaceHolderModifierDate = 21
  public static readonly LegacyPlaceholderModifierFormat = 22
  public static readonly LegacyPlaceholderModifierJoin = 23
  public static readonly LegacyPlaceHolderModifierOffsetFormat = 24
  public static readonly LEGACY_ARGS_COLON = 25
  public static readonly LEGACY_PLACEHOLDER_XPEND = 26
  public static readonly LEGACY_ARGS_XPEND = 27
  public static readonly LegacyPlaceholderArgs = 28
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
    null,
    "'}}'",
    "'|'",
    "','",
    "'('",
    "')'",
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
    "EXPR_WS",
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
    "StringLiteral",
    "ESCAPE",
    "EXPR_WS",
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
    4, 0, 28, 245, 6, -1, 6, -1, 6, -1, 6, -1, 6, -1, 2, 0, 7, 0, 2, 1, 7, 1, 2,
    2, 7, 2, 2, 3, 7, 3, 2, 4, 7, 4, 2, 5, 7, 5, 2, 6, 7, 6, 2, 7, 7, 7, 2, 8,
    7, 8, 2, 9, 7, 9, 2, 10, 7, 10, 2, 11, 7, 11, 2, 12, 7, 12, 2, 13, 7, 13, 2,
    14, 7, 14, 2, 15, 7, 15, 2, 16, 7, 16, 2, 17, 7, 17, 2, 18, 7, 18, 2, 19, 7,
    19, 2, 20, 7, 20, 2, 21, 7, 21, 2, 22, 7, 22, 2, 23, 7, 23, 2, 24, 7, 24, 2,
    25, 7, 25, 2, 26, 7, 26, 2, 27, 7, 27, 2, 28, 7, 28, 1, 0, 1, 0, 1, 0, 1, 0,
    1, 0, 4, 0, 69, 8, 0, 11, 0, 12, 0, 70, 1, 0, 1, 0, 1, 0, 1, 0, 3, 0, 77, 8,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 3, 4, 3,
    90, 8, 3, 11, 3, 12, 3, 91, 1, 3, 1, 3, 1, 4, 1, 4, 1, 4, 5, 4, 99, 8, 4,
    10, 4, 12, 4, 102, 9, 4, 1, 4, 1, 4, 1, 4, 1, 4, 5, 4, 108, 8, 4, 10, 4, 12,
    4, 111, 9, 4, 1, 4, 3, 4, 114, 8, 4, 1, 4, 1, 4, 1, 5, 1, 5, 1, 5, 1, 6, 4,
    6, 122, 8, 6, 11, 6, 12, 6, 123, 1, 6, 1, 6, 1, 7, 1, 7, 1, 7, 1, 7, 1, 7,
    1, 8, 1, 8, 1, 9, 1, 9, 1, 10, 1, 10, 1, 11, 1, 11, 1, 12, 1, 12, 1, 13, 1,
    13, 5, 13, 145, 8, 13, 10, 13, 12, 13, 148, 9, 13, 1, 14, 1, 14, 1, 14, 1,
    14, 1, 14, 1, 14, 1, 14, 1, 14, 1, 14, 3, 14, 159, 8, 14, 1, 15, 1, 15, 1,
    15, 5, 15, 164, 8, 15, 10, 15, 12, 15, 167, 9, 15, 3, 15, 169, 8, 15, 1, 16,
    1, 16, 1, 16, 1, 16, 1, 17, 1, 17, 1, 18, 1, 18, 5, 18, 179, 8, 18, 10, 18,
    12, 18, 182, 9, 18, 1, 19, 1, 19, 1, 19, 5, 19, 187, 8, 19, 10, 19, 12, 19,
    190, 9, 19, 3, 19, 192, 8, 19, 1, 20, 1, 20, 1, 20, 1, 20, 1, 21, 1, 21, 1,
    21, 1, 21, 1, 21, 1, 22, 1, 22, 1, 22, 1, 22, 1, 22, 1, 22, 1, 22, 1, 23, 1,
    23, 1, 23, 1, 23, 1, 23, 1, 24, 1, 24, 1, 24, 1, 24, 1, 24, 1, 24, 1, 24, 1,
    24, 1, 24, 1, 24, 1, 24, 1, 24, 1, 24, 1, 24, 1, 25, 1, 25, 1, 25, 1, 25, 1,
    26, 1, 26, 1, 26, 1, 26, 1, 27, 1, 27, 1, 27, 1, 27, 1, 28, 4, 28, 242, 8,
    28, 11, 28, 12, 28, 243, 2, 100, 109, 0, 29, 5, 2, 7, 3, 9, 4, 11, 5, 13, 0,
    15, 0, 17, 6, 19, 7, 21, 8, 23, 9, 25, 10, 27, 11, 29, 12, 31, 13, 33, 14,
    35, 15, 37, 16, 39, 17, 41, 18, 43, 19, 45, 20, 47, 21, 49, 22, 51, 23, 53,
    24, 55, 25, 57, 26, 59, 27, 61, 28, 5, 0, 1, 2, 3, 4, 10, 2, 0, 36, 36, 123,
    123, 1, 0, 123, 123, 3, 0, 9, 10, 13, 13, 32, 32, 4, 0, 10, 10, 13, 13, 34,
    34, 92, 92, 4, 0, 10, 10, 13, 13, 39, 39, 92, 92, 1, 0, 97, 122, 4, 0, 48,
    57, 65, 90, 95, 95, 97, 122, 1, 0, 49, 57, 1, 0, 48, 57, 1, 0, 125, 125,
    259, 0, 5, 1, 0, 0, 0, 0, 7, 1, 0, 0, 0, 0, 9, 1, 0, 0, 0, 0, 11, 1, 0, 0,
    0, 1, 13, 1, 0, 0, 0, 1, 17, 1, 0, 0, 0, 1, 19, 1, 0, 0, 0, 1, 21, 1, 0, 0,
    0, 1, 23, 1, 0, 0, 0, 1, 25, 1, 0, 0, 0, 1, 27, 1, 0, 0, 0, 1, 29, 1, 0, 0,
    0, 1, 31, 1, 0, 0, 0, 1, 33, 1, 0, 0, 0, 1, 35, 1, 0, 0, 0, 2, 37, 1, 0, 0,
    0, 2, 39, 1, 0, 0, 0, 2, 41, 1, 0, 0, 0, 2, 43, 1, 0, 0, 0, 2, 45, 1, 0, 0,
    0, 3, 47, 1, 0, 0, 0, 3, 49, 1, 0, 0, 0, 3, 51, 1, 0, 0, 0, 3, 53, 1, 0, 0,
    0, 3, 55, 1, 0, 0, 0, 3, 57, 1, 0, 0, 0, 4, 59, 1, 0, 0, 0, 4, 61, 1, 0, 0,
    0, 5, 76, 1, 0, 0, 0, 7, 78, 1, 0, 0, 0, 9, 83, 1, 0, 0, 0, 11, 89, 1, 0, 0,
    0, 13, 113, 1, 0, 0, 0, 15, 117, 1, 0, 0, 0, 17, 121, 1, 0, 0, 0, 19, 127,
    1, 0, 0, 0, 21, 132, 1, 0, 0, 0, 23, 134, 1, 0, 0, 0, 25, 136, 1, 0, 0, 0,
    27, 138, 1, 0, 0, 0, 29, 140, 1, 0, 0, 0, 31, 142, 1, 0, 0, 0, 33, 158, 1,
    0, 0, 0, 35, 168, 1, 0, 0, 0, 37, 170, 1, 0, 0, 0, 39, 174, 1, 0, 0, 0, 41,
    176, 1, 0, 0, 0, 43, 191, 1, 0, 0, 0, 45, 193, 1, 0, 0, 0, 47, 197, 1, 0, 0,
    0, 49, 202, 1, 0, 0, 0, 51, 209, 1, 0, 0, 0, 53, 214, 1, 0, 0, 0, 55, 228,
    1, 0, 0, 0, 57, 232, 1, 0, 0, 0, 59, 236, 1, 0, 0, 0, 61, 241, 1, 0, 0, 0,
    63, 69, 8, 0, 0, 0, 64, 65, 5, 123, 0, 0, 65, 69, 8, 1, 0, 0, 66, 67, 5, 36,
    0, 0, 67, 69, 8, 1, 0, 0, 68, 63, 1, 0, 0, 0, 68, 64, 1, 0, 0, 0, 68, 66, 1,
    0, 0, 0, 69, 70, 1, 0, 0, 0, 70, 68, 1, 0, 0, 0, 70, 71, 1, 0, 0, 0, 71, 77,
    1, 0, 0, 0, 72, 73, 5, 36, 0, 0, 73, 77, 5, 0, 0, 1, 74, 75, 5, 123, 0, 0,
    75, 77, 5, 0, 0, 1, 76, 68, 1, 0, 0, 0, 76, 72, 1, 0, 0, 0, 76, 74, 1, 0, 0,
    0, 77, 6, 1, 0, 0, 0, 78, 79, 5, 123, 0, 0, 79, 80, 5, 123, 0, 0, 80, 81, 1,
    0, 0, 0, 81, 82, 6, 1, 0, 0, 82, 8, 1, 0, 0, 0, 83, 84, 5, 36, 0, 0, 84, 85,
    5, 123, 0, 0, 85, 86, 1, 0, 0, 0, 86, 87, 6, 2, 1, 0, 87, 10, 1, 0, 0, 0,
    88, 90, 7, 2, 0, 0, 89, 88, 1, 0, 0, 0, 90, 91, 1, 0, 0, 0, 91, 89, 1, 0, 0,
    0, 91, 92, 1, 0, 0, 0, 92, 93, 1, 0, 0, 0, 93, 94, 6, 3, 2, 0, 94, 12, 1, 0,
    0, 0, 95, 100, 5, 34, 0, 0, 96, 99, 3, 15, 5, 0, 97, 99, 8, 3, 0, 0, 98, 96,
    1, 0, 0, 0, 98, 97, 1, 0, 0, 0, 99, 102, 1, 0, 0, 0, 100, 101, 1, 0, 0, 0,
    100, 98, 1, 0, 0, 0, 101, 103, 1, 0, 0, 0, 102, 100, 1, 0, 0, 0, 103, 114,
    5, 34, 0, 0, 104, 109, 5, 39, 0, 0, 105, 108, 3, 15, 5, 0, 106, 108, 8, 4,
    0, 0, 107, 105, 1, 0, 0, 0, 107, 106, 1, 0, 0, 0, 108, 111, 1, 0, 0, 0, 109,
    110, 1, 0, 0, 0, 109, 107, 1, 0, 0, 0, 110, 112, 1, 0, 0, 0, 111, 109, 1, 0,
    0, 0, 112, 114, 5, 39, 0, 0, 113, 95, 1, 0, 0, 0, 113, 104, 1, 0, 0, 0, 114,
    115, 1, 0, 0, 0, 115, 116, 6, 4, 3, 0, 116, 14, 1, 0, 0, 0, 117, 118, 5, 92,
    0, 0, 118, 119, 9, 0, 0, 0, 119, 16, 1, 0, 0, 0, 120, 122, 7, 2, 0, 0, 121,
    120, 1, 0, 0, 0, 122, 123, 1, 0, 0, 0, 123, 121, 1, 0, 0, 0, 123, 124, 1, 0,
    0, 0, 124, 125, 1, 0, 0, 0, 125, 126, 6, 6, 2, 0, 126, 18, 1, 0, 0, 0, 127,
    128, 5, 125, 0, 0, 128, 129, 5, 125, 0, 0, 129, 130, 1, 0, 0, 0, 130, 131,
    6, 7, 4, 0, 131, 20, 1, 0, 0, 0, 132, 133, 5, 124, 0, 0, 133, 22, 1, 0, 0,
    0, 134, 135, 5, 44, 0, 0, 135, 24, 1, 0, 0, 0, 136, 137, 5, 40, 0, 0, 137,
    26, 1, 0, 0, 0, 138, 139, 5, 41, 0, 0, 139, 28, 1, 0, 0, 0, 140, 141, 5, 46,
    0, 0, 141, 30, 1, 0, 0, 0, 142, 146, 7, 5, 0, 0, 143, 145, 7, 6, 0, 0, 144,
    143, 1, 0, 0, 0, 145, 148, 1, 0, 0, 0, 146, 144, 1, 0, 0, 0, 146, 147, 1, 0,
    0, 0, 147, 32, 1, 0, 0, 0, 148, 146, 1, 0, 0, 0, 149, 150, 5, 116, 0, 0,
    150, 151, 5, 114, 0, 0, 151, 152, 5, 117, 0, 0, 152, 159, 5, 101, 0, 0, 153,
    154, 5, 102, 0, 0, 154, 155, 5, 97, 0, 0, 155, 156, 5, 108, 0, 0, 156, 157,
    5, 115, 0, 0, 157, 159, 5, 101, 0, 0, 158, 149, 1, 0, 0, 0, 158, 153, 1, 0,
    0, 0, 159, 34, 1, 0, 0, 0, 160, 169, 5, 48, 0, 0, 161, 165, 7, 7, 0, 0, 162,
    164, 7, 8, 0, 0, 163, 162, 1, 0, 0, 0, 164, 167, 1, 0, 0, 0, 165, 163, 1, 0,
    0, 0, 165, 166, 1, 0, 0, 0, 166, 169, 1, 0, 0, 0, 167, 165, 1, 0, 0, 0, 168,
    160, 1, 0, 0, 0, 168, 161, 1, 0, 0, 0, 169, 36, 1, 0, 0, 0, 170, 171, 5, 58,
    0, 0, 171, 172, 1, 0, 0, 0, 172, 173, 6, 16, 5, 0, 173, 38, 1, 0, 0, 0, 174,
    175, 5, 46, 0, 0, 175, 40, 1, 0, 0, 0, 176, 180, 7, 5, 0, 0, 177, 179, 7, 6,
    0, 0, 178, 177, 1, 0, 0, 0, 179, 182, 1, 0, 0, 0, 180, 178, 1, 0, 0, 0, 180,
    181, 1, 0, 0, 0, 181, 42, 1, 0, 0, 0, 182, 180, 1, 0, 0, 0, 183, 192, 5, 48,
    0, 0, 184, 188, 7, 7, 0, 0, 185, 187, 7, 8, 0, 0, 186, 185, 1, 0, 0, 0, 187,
    190, 1, 0, 0, 0, 188, 186, 1, 0, 0, 0, 188, 189, 1, 0, 0, 0, 189, 192, 1, 0,
    0, 0, 190, 188, 1, 0, 0, 0, 191, 183, 1, 0, 0, 0, 191, 184, 1, 0, 0, 0, 192,
    44, 1, 0, 0, 0, 193, 194, 5, 125, 0, 0, 194, 195, 1, 0, 0, 0, 195, 196, 6,
    20, 4, 0, 196, 46, 1, 0, 0, 0, 197, 198, 5, 100, 0, 0, 198, 199, 5, 97, 0,
    0, 199, 200, 5, 116, 0, 0, 200, 201, 5, 101, 0, 0, 201, 48, 1, 0, 0, 0, 202,
    203, 5, 102, 0, 0, 203, 204, 5, 111, 0, 0, 204, 205, 5, 114, 0, 0, 205, 206,
    5, 109, 0, 0, 206, 207, 5, 97, 0, 0, 207, 208, 5, 116, 0, 0, 208, 50, 1, 0,
    0, 0, 209, 210, 5, 106, 0, 0, 210, 211, 5, 111, 0, 0, 211, 212, 5, 105, 0,
    0, 212, 213, 5, 110, 0, 0, 213, 52, 1, 0, 0, 0, 214, 215, 5, 111, 0, 0, 215,
    216, 5, 102, 0, 0, 216, 217, 5, 102, 0, 0, 217, 218, 5, 115, 0, 0, 218, 219,
    5, 101, 0, 0, 219, 220, 5, 116, 0, 0, 220, 221, 5, 45, 0, 0, 221, 222, 5,
    102, 0, 0, 222, 223, 5, 111, 0, 0, 223, 224, 5, 114, 0, 0, 224, 225, 5, 109,
    0, 0, 225, 226, 5, 97, 0, 0, 226, 227, 5, 116, 0, 0, 227, 54, 1, 0, 0, 0,
    228, 229, 5, 58, 0, 0, 229, 230, 1, 0, 0, 0, 230, 231, 6, 25, 6, 0, 231, 56,
    1, 0, 0, 0, 232, 233, 5, 125, 0, 0, 233, 234, 1, 0, 0, 0, 234, 235, 6, 26,
    4, 0, 235, 58, 1, 0, 0, 0, 236, 237, 5, 125, 0, 0, 237, 238, 1, 0, 0, 0,
    238, 239, 6, 27, 4, 0, 239, 60, 1, 0, 0, 0, 240, 242, 8, 9, 0, 0, 241, 240,
    1, 0, 0, 0, 242, 243, 1, 0, 0, 0, 243, 241, 1, 0, 0, 0, 243, 244, 1, 0, 0,
    0, 244, 62, 1, 0, 0, 0, 23, 0, 1, 2, 3, 4, 68, 70, 76, 91, 98, 100, 107,
    109, 113, 123, 146, 158, 165, 168, 180, 188, 191, 243, 7, 2, 1, 0, 2, 2, 0,
    6, 0, 0, 7, 1, 0, 2, 0, 0, 2, 3, 0, 2, 4, 0,
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
