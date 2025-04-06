/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as antlr from "antlr4ng"

import { ExprParserListener } from "./ExprParserListener.js"
// for running tests with parameters, TODO: discuss strategy for typed parameters in CI

// @ts-expect-error This is a generated file and cannot be suppressed
type int = number

export class ExprParser extends antlr.Parser {
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
  public static readonly RULE_template = 0
  public static readonly RULE_templatePart = 1
  public static readonly RULE_text = 2
  public static readonly RULE_expr = 3
  public static readonly RULE_dataRefName = 4
  public static readonly RULE_refObjectName = 5
  public static readonly RULE_refAttrName = 6
  public static readonly RULE_filterChain = 7
  public static readonly RULE_filterExpr = 8
  public static readonly RULE_filterName = 9
  public static readonly RULE_filterArgs = 10
  public static readonly RULE_filterArg = 11
  public static readonly RULE_legacyExpr = 12
  public static readonly RULE_legacyDataRefName = 13
  public static readonly RULE_legacyRefObjectName = 14
  public static readonly RULE_legacyRefAttrName = 15
  public static readonly RULE_legacyPlaceholderExpr = 16

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
  public static readonly ruleNames = [
    "template",
    "templatePart",
    "text",
    "expr",
    "dataRefName",
    "refObjectName",
    "refAttrName",
    "filterChain",
    "filterExpr",
    "filterName",
    "filterArgs",
    "filterArg",
    "legacyExpr",
    "legacyDataRefName",
    "legacyRefObjectName",
    "legacyRefAttrName",
    "legacyPlaceholderExpr",
  ]

  public get grammarFileName(): string {
    return "ExprParser.g4"
  }
  public get literalNames(): (string | null)[] {
    return ExprParser.literalNames
  }
  public get symbolicNames(): (string | null)[] {
    return ExprParser.symbolicNames
  }
  public get ruleNames(): string[] {
    return ExprParser.ruleNames
  }
  public get serializedATN(): number[] {
    return ExprParser._serializedATN
  }

  protected createFailedPredicateException(
    predicate?: string,
    message?: string,
  ): antlr.FailedPredicateException {
    return new antlr.FailedPredicateException(this, predicate, message)
  }

  public constructor(input: antlr.TokenStream) {
    super(input)
    this.interpreter = new antlr.ParserATNSimulator(
      this,
      ExprParser._ATN,
      ExprParser.decisionsToDFA,
      new antlr.PredictionContextCache(),
    )
  }
  public template(): TemplateContext {
    const localContext = new TemplateContext(this.context, this.state)
    this.enterRule(localContext, 0, ExprParser.RULE_template)
    let _la: number
    try {
      this.enterOuterAlt(localContext, 1)
      {
        this.state = 37
        this.errorHandler.sync(this)
        _la = this.tokenStream.LA(1)
        while ((_la & ~0x1f) === 0 && ((1 << _la) & 28) !== 0) {
          {
            {
              this.state = 34
              this.templatePart()
            }
          }
          this.state = 39
          this.errorHandler.sync(this)
          _la = this.tokenStream.LA(1)
        }
        this.state = 40
        this.match(ExprParser.EOF)
      }
    } catch (re) {
      if (re instanceof antlr.RecognitionException) {
        this.errorHandler.reportError(this, re)
        this.errorHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return localContext
  }
  public templatePart(): TemplatePartContext {
    const localContext = new TemplatePartContext(this.context, this.state)
    this.enterRule(localContext, 2, ExprParser.RULE_templatePart)
    try {
      this.state = 45
      this.errorHandler.sync(this)
      switch (this.tokenStream.LA(1)) {
        case ExprParser.TEXT:
          this.enterOuterAlt(localContext, 1)
          {
            this.state = 42
            this.text()
          }
          break
        case ExprParser.XPSTART:
          this.enterOuterAlt(localContext, 2)
          {
            this.state = 43
            this.expr()
          }
          break
        case ExprParser.LEGACY_XPSTART:
          this.enterOuterAlt(localContext, 3)
          {
            this.state = 44
            this.legacyExpr()
          }
          break
        default:
          throw new antlr.NoViableAltException(this)
      }
    } catch (re) {
      if (re instanceof antlr.RecognitionException) {
        this.errorHandler.reportError(this, re)
        this.errorHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return localContext
  }
  public text(): TextContext {
    const localContext = new TextContext(this.context, this.state)
    this.enterRule(localContext, 4, ExprParser.RULE_text)
    try {
      this.enterOuterAlt(localContext, 1)
      {
        this.state = 47
        this.match(ExprParser.TEXT)
      }
    } catch (re) {
      if (re instanceof antlr.RecognitionException) {
        this.errorHandler.reportError(this, re)
        this.errorHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return localContext
  }
  public expr(): ExprContext {
    const localContext = new ExprContext(this.context, this.state)
    this.enterRule(localContext, 6, ExprParser.RULE_expr)
    let _la: number
    try {
      this.enterOuterAlt(localContext, 1)
      {
        this.state = 49
        this.match(ExprParser.XPSTART)
        this.state = 50
        this.dataRefName()
        this.state = 52
        this.errorHandler.sync(this)
        _la = this.tokenStream.LA(1)
        if (_la === 7) {
          {
            this.state = 51
            this.filterChain()
          }
        }

        this.state = 54
        this.match(ExprParser.XPEND)
      }
    } catch (re) {
      if (re instanceof antlr.RecognitionException) {
        this.errorHandler.reportError(this, re)
        this.errorHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return localContext
  }
  public dataRefName(): DataRefNameContext {
    const localContext = new DataRefNameContext(this.context, this.state)
    this.enterRule(localContext, 8, ExprParser.RULE_dataRefName)
    try {
      this.enterOuterAlt(localContext, 1)
      {
        this.state = 56
        this.refObjectName()
        this.state = 57
        this.refAttrName()
      }
    } catch (re) {
      if (re instanceof antlr.RecognitionException) {
        this.errorHandler.reportError(this, re)
        this.errorHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return localContext
  }
  public refObjectName(): RefObjectNameContext {
    const localContext = new RefObjectNameContext(this.context, this.state)
    this.enterRule(localContext, 10, ExprParser.RULE_refObjectName)
    try {
      this.enterOuterAlt(localContext, 1)
      {
        this.state = 59
        this.match(ExprParser.ID)
      }
    } catch (re) {
      if (re instanceof antlr.RecognitionException) {
        this.errorHandler.reportError(this, re)
        this.errorHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return localContext
  }
  public refAttrName(): RefAttrNameContext {
    const localContext = new RefAttrNameContext(this.context, this.state)
    this.enterRule(localContext, 12, ExprParser.RULE_refAttrName)
    let _la: number
    try {
      this.enterOuterAlt(localContext, 1)
      {
        this.state = 63
        this.errorHandler.sync(this)
        _la = this.tokenStream.LA(1)
        do {
          {
            {
              this.state = 61
              this.match(ExprParser.DOT)
              this.state = 62
              _la = this.tokenStream.LA(1)
              if (!(_la === 12 || _la === 14)) {
                this.errorHandler.recoverInline(this)
              } else {
                this.errorHandler.reportMatch(this)
                this.consume()
              }
            }
          }
          this.state = 65
          this.errorHandler.sync(this)
          _la = this.tokenStream.LA(1)
        } while (_la === 11)
      }
    } catch (re) {
      if (re instanceof antlr.RecognitionException) {
        this.errorHandler.reportError(this, re)
        this.errorHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return localContext
  }
  public filterChain(): FilterChainContext {
    const localContext = new FilterChainContext(this.context, this.state)
    this.enterRule(localContext, 14, ExprParser.RULE_filterChain)
    let _la: number
    try {
      this.enterOuterAlt(localContext, 1)
      {
        this.state = 69
        this.errorHandler.sync(this)
        _la = this.tokenStream.LA(1)
        do {
          {
            {
              this.state = 67
              this.match(ExprParser.PIPE)
              this.state = 68
              this.filterExpr()
            }
          }
          this.state = 71
          this.errorHandler.sync(this)
          _la = this.tokenStream.LA(1)
        } while (_la === 7)
      }
    } catch (re) {
      if (re instanceof antlr.RecognitionException) {
        this.errorHandler.reportError(this, re)
        this.errorHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return localContext
  }
  public filterExpr(): FilterExprContext {
    const localContext = new FilterExprContext(this.context, this.state)
    this.enterRule(localContext, 16, ExprParser.RULE_filterExpr)
    let _la: number
    try {
      this.enterOuterAlt(localContext, 1)
      {
        this.state = 73
        this.filterName()
        this.state = 74
        this.match(ExprParser.LPAREN)
        this.state = 76
        this.errorHandler.sync(this)
        _la = this.tokenStream.LA(1)
        if ((_la & ~0x1f) === 0 && ((1 << _la) & 24578) !== 0) {
          {
            this.state = 75
            this.filterArgs()
          }
        }

        this.state = 78
        this.match(ExprParser.RPAREN)
      }
    } catch (re) {
      if (re instanceof antlr.RecognitionException) {
        this.errorHandler.reportError(this, re)
        this.errorHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return localContext
  }
  public filterName(): FilterNameContext {
    const localContext = new FilterNameContext(this.context, this.state)
    this.enterRule(localContext, 18, ExprParser.RULE_filterName)
    try {
      this.enterOuterAlt(localContext, 1)
      {
        this.state = 80
        this.match(ExprParser.ID)
      }
    } catch (re) {
      if (re instanceof antlr.RecognitionException) {
        this.errorHandler.reportError(this, re)
        this.errorHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return localContext
  }
  public filterArgs(): FilterArgsContext {
    const localContext = new FilterArgsContext(this.context, this.state)
    this.enterRule(localContext, 20, ExprParser.RULE_filterArgs)
    let _la: number
    try {
      this.enterOuterAlt(localContext, 1)
      {
        this.state = 82
        this.filterArg()
        this.state = 87
        this.errorHandler.sync(this)
        _la = this.tokenStream.LA(1)
        while (_la === 8) {
          {
            {
              this.state = 83
              this.match(ExprParser.COMMA)
              this.state = 84
              this.filterArg()
            }
          }
          this.state = 89
          this.errorHandler.sync(this)
          _la = this.tokenStream.LA(1)
        }
      }
    } catch (re) {
      if (re instanceof antlr.RecognitionException) {
        this.errorHandler.reportError(this, re)
        this.errorHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return localContext
  }
  public filterArg(): FilterArgContext {
    const localContext = new FilterArgContext(this.context, this.state)
    this.enterRule(localContext, 22, ExprParser.RULE_filterArg)
    let _la: number
    try {
      this.enterOuterAlt(localContext, 1)
      {
        this.state = 90
        _la = this.tokenStream.LA(1)
        if (!((_la & ~0x1f) === 0 && ((1 << _la) & 24578) !== 0)) {
          this.errorHandler.recoverInline(this)
        } else {
          this.errorHandler.reportMatch(this)
          this.consume()
        }
      }
    } catch (re) {
      if (re instanceof antlr.RecognitionException) {
        this.errorHandler.reportError(this, re)
        this.errorHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return localContext
  }
  public legacyExpr(): LegacyExprContext {
    const localContext = new LegacyExprContext(this.context, this.state)
    this.enterRule(localContext, 24, ExprParser.RULE_legacyExpr)
    let _la: number
    try {
      this.enterOuterAlt(localContext, 1)
      {
        this.state = 92
        this.match(ExprParser.LEGACY_XPSTART)
        this.state = 93
        this.legacyDataRefName()
        this.state = 96
        this.errorHandler.sync(this)
        _la = this.tokenStream.LA(1)
        if (_la === 15) {
          {
            this.state = 94
            this.match(ExprParser.LEGACY_COLON)
            this.state = 95
            this.legacyPlaceholderExpr()
          }
        }

        this.state = 98
        _la = this.tokenStream.LA(1)
        if (!((_la & ~0x1f) === 0 && ((1 << _la) & 101187584) !== 0)) {
          this.errorHandler.recoverInline(this)
        } else {
          this.errorHandler.reportMatch(this)
          this.consume()
        }
      }
    } catch (re) {
      if (re instanceof antlr.RecognitionException) {
        this.errorHandler.reportError(this, re)
        this.errorHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return localContext
  }
  public legacyDataRefName(): LegacyDataRefNameContext {
    const localContext = new LegacyDataRefNameContext(this.context, this.state)
    this.enterRule(localContext, 26, ExprParser.RULE_legacyDataRefName)
    try {
      this.enterOuterAlt(localContext, 1)
      {
        this.state = 100
        this.legacyRefObjectName()
        this.state = 101
        this.legacyRefAttrName()
      }
    } catch (re) {
      if (re instanceof antlr.RecognitionException) {
        this.errorHandler.reportError(this, re)
        this.errorHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return localContext
  }
  public legacyRefObjectName(): LegacyRefObjectNameContext {
    const localContext = new LegacyRefObjectNameContext(
      this.context,
      this.state,
    )
    this.enterRule(localContext, 28, ExprParser.RULE_legacyRefObjectName)
    try {
      this.enterOuterAlt(localContext, 1)
      {
        this.state = 103
        this.match(ExprParser.LEGACY_ID)
      }
    } catch (re) {
      if (re instanceof antlr.RecognitionException) {
        this.errorHandler.reportError(this, re)
        this.errorHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return localContext
  }
  public legacyRefAttrName(): LegacyRefAttrNameContext {
    const localContext = new LegacyRefAttrNameContext(this.context, this.state)
    this.enterRule(localContext, 30, ExprParser.RULE_legacyRefAttrName)
    let _la: number
    try {
      this.enterOuterAlt(localContext, 1)
      {
        this.state = 107
        this.errorHandler.sync(this)
        _la = this.tokenStream.LA(1)
        do {
          {
            {
              this.state = 105
              this.match(ExprParser.LEGACY_DOT)
              this.state = 106
              _la = this.tokenStream.LA(1)
              if (!(_la === 17 || _la === 18)) {
                this.errorHandler.recoverInline(this)
              } else {
                this.errorHandler.reportMatch(this)
                this.consume()
              }
            }
          }
          this.state = 109
          this.errorHandler.sync(this)
          _la = this.tokenStream.LA(1)
        } while (_la === 16)
      }
    } catch (re) {
      if (re instanceof antlr.RecognitionException) {
        this.errorHandler.reportError(this, re)
        this.errorHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return localContext
  }
  public legacyPlaceholderExpr(): LegacyPlaceholderExprContext {
    const localContext = new LegacyPlaceholderExprContext(
      this.context,
      this.state,
    )
    this.enterRule(localContext, 32, ExprParser.RULE_legacyPlaceholderExpr)
    let _la: number
    try {
      this.enterOuterAlt(localContext, 1)
      {
        this.state = 111
        _la = this.tokenStream.LA(1)
        if (!((_la & ~0x1f) === 0 && ((1 << _la) & 15728640) !== 0)) {
          this.errorHandler.recoverInline(this)
        } else {
          this.errorHandler.reportMatch(this)
          this.consume()
        }
        this.state = 114
        this.errorHandler.sync(this)
        _la = this.tokenStream.LA(1)
        if (_la === 24) {
          {
            this.state = 112
            this.match(ExprParser.LEGACY_ARGS_COLON)
            this.state = 113
            this.match(ExprParser.LegacyPlaceholderArgs)
          }
        }
      }
    } catch (re) {
      if (re instanceof antlr.RecognitionException) {
        this.errorHandler.reportError(this, re)
        this.errorHandler.recover(this, re)
      } else {
        throw re
      }
    } finally {
      this.exitRule()
    }
    return localContext
  }

  public static readonly _serializedATN: number[] = [
    4, 1, 27, 117, 2, 0, 7, 0, 2, 1, 7, 1, 2, 2, 7, 2, 2, 3, 7, 3, 2, 4, 7, 4,
    2, 5, 7, 5, 2, 6, 7, 6, 2, 7, 7, 7, 2, 8, 7, 8, 2, 9, 7, 9, 2, 10, 7, 10, 2,
    11, 7, 11, 2, 12, 7, 12, 2, 13, 7, 13, 2, 14, 7, 14, 2, 15, 7, 15, 2, 16, 7,
    16, 1, 0, 5, 0, 36, 8, 0, 10, 0, 12, 0, 39, 9, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1,
    1, 3, 1, 46, 8, 1, 1, 2, 1, 2, 1, 3, 1, 3, 1, 3, 3, 3, 53, 8, 3, 1, 3, 1, 3,
    1, 4, 1, 4, 1, 4, 1, 5, 1, 5, 1, 6, 1, 6, 4, 6, 64, 8, 6, 11, 6, 12, 6, 65,
    1, 7, 1, 7, 4, 7, 70, 8, 7, 11, 7, 12, 7, 71, 1, 8, 1, 8, 1, 8, 3, 8, 77, 8,
    8, 1, 8, 1, 8, 1, 9, 1, 9, 1, 10, 1, 10, 1, 10, 5, 10, 86, 8, 10, 10, 10,
    12, 10, 89, 9, 10, 1, 11, 1, 11, 1, 12, 1, 12, 1, 12, 1, 12, 3, 12, 97, 8,
    12, 1, 12, 1, 12, 1, 13, 1, 13, 1, 13, 1, 14, 1, 14, 1, 15, 1, 15, 4, 15,
    108, 8, 15, 11, 15, 12, 15, 109, 1, 16, 1, 16, 1, 16, 3, 16, 115, 8, 16, 1,
    16, 0, 0, 17, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32,
    0, 5, 2, 0, 12, 12, 14, 14, 2, 0, 1, 1, 13, 14, 2, 0, 19, 19, 25, 26, 1, 0,
    17, 18, 1, 0, 20, 23, 110, 0, 37, 1, 0, 0, 0, 2, 45, 1, 0, 0, 0, 4, 47, 1,
    0, 0, 0, 6, 49, 1, 0, 0, 0, 8, 56, 1, 0, 0, 0, 10, 59, 1, 0, 0, 0, 12, 63,
    1, 0, 0, 0, 14, 69, 1, 0, 0, 0, 16, 73, 1, 0, 0, 0, 18, 80, 1, 0, 0, 0, 20,
    82, 1, 0, 0, 0, 22, 90, 1, 0, 0, 0, 24, 92, 1, 0, 0, 0, 26, 100, 1, 0, 0, 0,
    28, 103, 1, 0, 0, 0, 30, 107, 1, 0, 0, 0, 32, 111, 1, 0, 0, 0, 34, 36, 3, 2,
    1, 0, 35, 34, 1, 0, 0, 0, 36, 39, 1, 0, 0, 0, 37, 35, 1, 0, 0, 0, 37, 38, 1,
    0, 0, 0, 38, 40, 1, 0, 0, 0, 39, 37, 1, 0, 0, 0, 40, 41, 5, 0, 0, 1, 41, 1,
    1, 0, 0, 0, 42, 46, 3, 4, 2, 0, 43, 46, 3, 6, 3, 0, 44, 46, 3, 24, 12, 0,
    45, 42, 1, 0, 0, 0, 45, 43, 1, 0, 0, 0, 45, 44, 1, 0, 0, 0, 46, 3, 1, 0, 0,
    0, 47, 48, 5, 2, 0, 0, 48, 5, 1, 0, 0, 0, 49, 50, 5, 3, 0, 0, 50, 52, 3, 8,
    4, 0, 51, 53, 3, 14, 7, 0, 52, 51, 1, 0, 0, 0, 52, 53, 1, 0, 0, 0, 53, 54,
    1, 0, 0, 0, 54, 55, 5, 6, 0, 0, 55, 7, 1, 0, 0, 0, 56, 57, 3, 10, 5, 0, 57,
    58, 3, 12, 6, 0, 58, 9, 1, 0, 0, 0, 59, 60, 5, 12, 0, 0, 60, 11, 1, 0, 0, 0,
    61, 62, 5, 11, 0, 0, 62, 64, 7, 0, 0, 0, 63, 61, 1, 0, 0, 0, 64, 65, 1, 0,
    0, 0, 65, 63, 1, 0, 0, 0, 65, 66, 1, 0, 0, 0, 66, 13, 1, 0, 0, 0, 67, 68, 5,
    7, 0, 0, 68, 70, 3, 16, 8, 0, 69, 67, 1, 0, 0, 0, 70, 71, 1, 0, 0, 0, 71,
    69, 1, 0, 0, 0, 71, 72, 1, 0, 0, 0, 72, 15, 1, 0, 0, 0, 73, 74, 3, 18, 9, 0,
    74, 76, 5, 9, 0, 0, 75, 77, 3, 20, 10, 0, 76, 75, 1, 0, 0, 0, 76, 77, 1, 0,
    0, 0, 77, 78, 1, 0, 0, 0, 78, 79, 5, 10, 0, 0, 79, 17, 1, 0, 0, 0, 80, 81,
    5, 12, 0, 0, 81, 19, 1, 0, 0, 0, 82, 87, 3, 22, 11, 0, 83, 84, 5, 8, 0, 0,
    84, 86, 3, 22, 11, 0, 85, 83, 1, 0, 0, 0, 86, 89, 1, 0, 0, 0, 87, 85, 1, 0,
    0, 0, 87, 88, 1, 0, 0, 0, 88, 21, 1, 0, 0, 0, 89, 87, 1, 0, 0, 0, 90, 91, 7,
    1, 0, 0, 91, 23, 1, 0, 0, 0, 92, 93, 5, 4, 0, 0, 93, 96, 3, 26, 13, 0, 94,
    95, 5, 15, 0, 0, 95, 97, 3, 32, 16, 0, 96, 94, 1, 0, 0, 0, 96, 97, 1, 0, 0,
    0, 97, 98, 1, 0, 0, 0, 98, 99, 7, 2, 0, 0, 99, 25, 1, 0, 0, 0, 100, 101, 3,
    28, 14, 0, 101, 102, 3, 30, 15, 0, 102, 27, 1, 0, 0, 0, 103, 104, 5, 17, 0,
    0, 104, 29, 1, 0, 0, 0, 105, 106, 5, 16, 0, 0, 106, 108, 7, 3, 0, 0, 107,
    105, 1, 0, 0, 0, 108, 109, 1, 0, 0, 0, 109, 107, 1, 0, 0, 0, 109, 110, 1, 0,
    0, 0, 110, 31, 1, 0, 0, 0, 111, 114, 7, 4, 0, 0, 112, 113, 5, 24, 0, 0, 113,
    115, 5, 27, 0, 0, 114, 112, 1, 0, 0, 0, 114, 115, 1, 0, 0, 0, 115, 33, 1, 0,
    0, 0, 10, 37, 45, 52, 65, 71, 76, 87, 96, 109, 114,
  ]

  private static __ATN: antlr.ATN
  public static get _ATN(): antlr.ATN {
    if (!ExprParser.__ATN) {
      ExprParser.__ATN = new antlr.ATNDeserializer().deserialize(
        ExprParser._serializedATN,
      )
    }

    return ExprParser.__ATN
  }

  private static readonly vocabulary = new antlr.Vocabulary(
    ExprParser.literalNames,
    ExprParser.symbolicNames,
    [],
  )

  public override get vocabulary(): antlr.Vocabulary {
    return ExprParser.vocabulary
  }

  private static readonly decisionsToDFA = ExprParser._ATN.decisionToState.map(
    (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index),
  )
}

export class TemplateContext extends antlr.ParserRuleContext {
  public constructor(
    parent: antlr.ParserRuleContext | null,
    invokingState: number,
  ) {
    super(parent, invokingState)
  }
  public EOF(): antlr.TerminalNode {
    return this.getToken(ExprParser.EOF, 0)!
  }
  public templatePart(): TemplatePartContext[]
  public templatePart(i: number): TemplatePartContext | null
  public templatePart(
    i?: number,
  ): TemplatePartContext[] | TemplatePartContext | null {
    if (i === undefined) {
      return this.getRuleContexts(TemplatePartContext)
    }

    return this.getRuleContext(i, TemplatePartContext)
  }
  public override get ruleIndex(): number {
    return ExprParser.RULE_template
  }
  public override enterRule(listener: ExprParserListener): void {
    if (listener.enterTemplate) {
      listener.enterTemplate(this)
    }
  }
  public override exitRule(listener: ExprParserListener): void {
    if (listener.exitTemplate) {
      listener.exitTemplate(this)
    }
  }
}

export class TemplatePartContext extends antlr.ParserRuleContext {
  public constructor(
    parent: antlr.ParserRuleContext | null,
    invokingState: number,
  ) {
    super(parent, invokingState)
  }
  public text(): TextContext | null {
    return this.getRuleContext(0, TextContext)
  }
  public expr(): ExprContext | null {
    return this.getRuleContext(0, ExprContext)
  }
  public legacyExpr(): LegacyExprContext | null {
    return this.getRuleContext(0, LegacyExprContext)
  }
  public override get ruleIndex(): number {
    return ExprParser.RULE_templatePart
  }
  public override enterRule(listener: ExprParserListener): void {
    if (listener.enterTemplatePart) {
      listener.enterTemplatePart(this)
    }
  }
  public override exitRule(listener: ExprParserListener): void {
    if (listener.exitTemplatePart) {
      listener.exitTemplatePart(this)
    }
  }
}

export class TextContext extends antlr.ParserRuleContext {
  public constructor(
    parent: antlr.ParserRuleContext | null,
    invokingState: number,
  ) {
    super(parent, invokingState)
  }
  public TEXT(): antlr.TerminalNode {
    return this.getToken(ExprParser.TEXT, 0)!
  }
  public override get ruleIndex(): number {
    return ExprParser.RULE_text
  }
  public override enterRule(listener: ExprParserListener): void {
    if (listener.enterText) {
      listener.enterText(this)
    }
  }
  public override exitRule(listener: ExprParserListener): void {
    if (listener.exitText) {
      listener.exitText(this)
    }
  }
}

export class ExprContext extends antlr.ParserRuleContext {
  public constructor(
    parent: antlr.ParserRuleContext | null,
    invokingState: number,
  ) {
    super(parent, invokingState)
  }
  public XPSTART(): antlr.TerminalNode {
    return this.getToken(ExprParser.XPSTART, 0)!
  }
  public dataRefName(): DataRefNameContext {
    return this.getRuleContext(0, DataRefNameContext)!
  }
  public XPEND(): antlr.TerminalNode {
    return this.getToken(ExprParser.XPEND, 0)!
  }
  public filterChain(): FilterChainContext | null {
    return this.getRuleContext(0, FilterChainContext)
  }
  public override get ruleIndex(): number {
    return ExprParser.RULE_expr
  }
  public override enterRule(listener: ExprParserListener): void {
    if (listener.enterExpr) {
      listener.enterExpr(this)
    }
  }
  public override exitRule(listener: ExprParserListener): void {
    if (listener.exitExpr) {
      listener.exitExpr(this)
    }
  }
}

export class DataRefNameContext extends antlr.ParserRuleContext {
  public constructor(
    parent: antlr.ParserRuleContext | null,
    invokingState: number,
  ) {
    super(parent, invokingState)
  }
  public refObjectName(): RefObjectNameContext {
    return this.getRuleContext(0, RefObjectNameContext)!
  }
  public refAttrName(): RefAttrNameContext {
    return this.getRuleContext(0, RefAttrNameContext)!
  }
  public override get ruleIndex(): number {
    return ExprParser.RULE_dataRefName
  }
  public override enterRule(listener: ExprParserListener): void {
    if (listener.enterDataRefName) {
      listener.enterDataRefName(this)
    }
  }
  public override exitRule(listener: ExprParserListener): void {
    if (listener.exitDataRefName) {
      listener.exitDataRefName(this)
    }
  }
}

export class RefObjectNameContext extends antlr.ParserRuleContext {
  public constructor(
    parent: antlr.ParserRuleContext | null,
    invokingState: number,
  ) {
    super(parent, invokingState)
  }
  public ID(): antlr.TerminalNode {
    return this.getToken(ExprParser.ID, 0)!
  }
  public override get ruleIndex(): number {
    return ExprParser.RULE_refObjectName
  }
  public override enterRule(listener: ExprParserListener): void {
    if (listener.enterRefObjectName) {
      listener.enterRefObjectName(this)
    }
  }
  public override exitRule(listener: ExprParserListener): void {
    if (listener.exitRefObjectName) {
      listener.exitRefObjectName(this)
    }
  }
}

export class RefAttrNameContext extends antlr.ParserRuleContext {
  public constructor(
    parent: antlr.ParserRuleContext | null,
    invokingState: number,
  ) {
    super(parent, invokingState)
  }
  public DOT(): antlr.TerminalNode[]
  public DOT(i: number): antlr.TerminalNode | null
  public DOT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    if (i === undefined) {
      return this.getTokens(ExprParser.DOT)
    } else {
      return this.getToken(ExprParser.DOT, i)
    }
  }
  public ID(): antlr.TerminalNode[]
  public ID(i: number): antlr.TerminalNode | null
  public ID(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    if (i === undefined) {
      return this.getTokens(ExprParser.ID)
    } else {
      return this.getToken(ExprParser.ID, i)
    }
  }
  public IntegerLiteral(): antlr.TerminalNode[]
  public IntegerLiteral(i: number): antlr.TerminalNode | null
  public IntegerLiteral(
    i?: number,
  ): antlr.TerminalNode | null | antlr.TerminalNode[] {
    if (i === undefined) {
      return this.getTokens(ExprParser.IntegerLiteral)
    } else {
      return this.getToken(ExprParser.IntegerLiteral, i)
    }
  }
  public override get ruleIndex(): number {
    return ExprParser.RULE_refAttrName
  }
  public override enterRule(listener: ExprParserListener): void {
    if (listener.enterRefAttrName) {
      listener.enterRefAttrName(this)
    }
  }
  public override exitRule(listener: ExprParserListener): void {
    if (listener.exitRefAttrName) {
      listener.exitRefAttrName(this)
    }
  }
}

export class FilterChainContext extends antlr.ParserRuleContext {
  public constructor(
    parent: antlr.ParserRuleContext | null,
    invokingState: number,
  ) {
    super(parent, invokingState)
  }
  public PIPE(): antlr.TerminalNode[]
  public PIPE(i: number): antlr.TerminalNode | null
  public PIPE(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    if (i === undefined) {
      return this.getTokens(ExprParser.PIPE)
    } else {
      return this.getToken(ExprParser.PIPE, i)
    }
  }
  public filterExpr(): FilterExprContext[]
  public filterExpr(i: number): FilterExprContext | null
  public filterExpr(
    i?: number,
  ): FilterExprContext[] | FilterExprContext | null {
    if (i === undefined) {
      return this.getRuleContexts(FilterExprContext)
    }

    return this.getRuleContext(i, FilterExprContext)
  }
  public override get ruleIndex(): number {
    return ExprParser.RULE_filterChain
  }
  public override enterRule(listener: ExprParserListener): void {
    if (listener.enterFilterChain) {
      listener.enterFilterChain(this)
    }
  }
  public override exitRule(listener: ExprParserListener): void {
    if (listener.exitFilterChain) {
      listener.exitFilterChain(this)
    }
  }
}

export class FilterExprContext extends antlr.ParserRuleContext {
  public constructor(
    parent: antlr.ParserRuleContext | null,
    invokingState: number,
  ) {
    super(parent, invokingState)
  }
  public filterName(): FilterNameContext {
    return this.getRuleContext(0, FilterNameContext)!
  }
  public LPAREN(): antlr.TerminalNode {
    return this.getToken(ExprParser.LPAREN, 0)!
  }
  public RPAREN(): antlr.TerminalNode {
    return this.getToken(ExprParser.RPAREN, 0)!
  }
  public filterArgs(): FilterArgsContext | null {
    return this.getRuleContext(0, FilterArgsContext)
  }
  public override get ruleIndex(): number {
    return ExprParser.RULE_filterExpr
  }
  public override enterRule(listener: ExprParserListener): void {
    if (listener.enterFilterExpr) {
      listener.enterFilterExpr(this)
    }
  }
  public override exitRule(listener: ExprParserListener): void {
    if (listener.exitFilterExpr) {
      listener.exitFilterExpr(this)
    }
  }
}

export class FilterNameContext extends antlr.ParserRuleContext {
  public constructor(
    parent: antlr.ParserRuleContext | null,
    invokingState: number,
  ) {
    super(parent, invokingState)
  }
  public ID(): antlr.TerminalNode {
    return this.getToken(ExprParser.ID, 0)!
  }
  public override get ruleIndex(): number {
    return ExprParser.RULE_filterName
  }
  public override enterRule(listener: ExprParserListener): void {
    if (listener.enterFilterName) {
      listener.enterFilterName(this)
    }
  }
  public override exitRule(listener: ExprParserListener): void {
    if (listener.exitFilterName) {
      listener.exitFilterName(this)
    }
  }
}

export class FilterArgsContext extends antlr.ParserRuleContext {
  public constructor(
    parent: antlr.ParserRuleContext | null,
    invokingState: number,
  ) {
    super(parent, invokingState)
  }
  public filterArg(): FilterArgContext[]
  public filterArg(i: number): FilterArgContext | null
  public filterArg(i?: number): FilterArgContext[] | FilterArgContext | null {
    if (i === undefined) {
      return this.getRuleContexts(FilterArgContext)
    }

    return this.getRuleContext(i, FilterArgContext)
  }
  public COMMA(): antlr.TerminalNode[]
  public COMMA(i: number): antlr.TerminalNode | null
  public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    if (i === undefined) {
      return this.getTokens(ExprParser.COMMA)
    } else {
      return this.getToken(ExprParser.COMMA, i)
    }
  }
  public override get ruleIndex(): number {
    return ExprParser.RULE_filterArgs
  }
  public override enterRule(listener: ExprParserListener): void {
    if (listener.enterFilterArgs) {
      listener.enterFilterArgs(this)
    }
  }
  public override exitRule(listener: ExprParserListener): void {
    if (listener.exitFilterArgs) {
      listener.exitFilterArgs(this)
    }
  }
}

export class FilterArgContext extends antlr.ParserRuleContext {
  public constructor(
    parent: antlr.ParserRuleContext | null,
    invokingState: number,
  ) {
    super(parent, invokingState)
  }
  public BooleanLiteral(): antlr.TerminalNode | null {
    return this.getToken(ExprParser.BooleanLiteral, 0)
  }
  public IntegerLiteral(): antlr.TerminalNode | null {
    return this.getToken(ExprParser.IntegerLiteral, 0)
  }
  public STRING(): antlr.TerminalNode | null {
    return this.getToken(ExprParser.STRING, 0)
  }
  public override get ruleIndex(): number {
    return ExprParser.RULE_filterArg
  }
  public override enterRule(listener: ExprParserListener): void {
    if (listener.enterFilterArg) {
      listener.enterFilterArg(this)
    }
  }
  public override exitRule(listener: ExprParserListener): void {
    if (listener.exitFilterArg) {
      listener.exitFilterArg(this)
    }
  }
}

export class LegacyExprContext extends antlr.ParserRuleContext {
  public constructor(
    parent: antlr.ParserRuleContext | null,
    invokingState: number,
  ) {
    super(parent, invokingState)
  }
  public LEGACY_XPSTART(): antlr.TerminalNode {
    return this.getToken(ExprParser.LEGACY_XPSTART, 0)!
  }
  public legacyDataRefName(): LegacyDataRefNameContext {
    return this.getRuleContext(0, LegacyDataRefNameContext)!
  }
  public LEGACY_EXPR_XPEND(): antlr.TerminalNode | null {
    return this.getToken(ExprParser.LEGACY_EXPR_XPEND, 0)
  }
  public LEGACY_PLACEHOLDER_XPEND(): antlr.TerminalNode | null {
    return this.getToken(ExprParser.LEGACY_PLACEHOLDER_XPEND, 0)
  }
  public LEGACY_ARGS_XPEND(): antlr.TerminalNode | null {
    return this.getToken(ExprParser.LEGACY_ARGS_XPEND, 0)
  }
  public LEGACY_COLON(): antlr.TerminalNode | null {
    return this.getToken(ExprParser.LEGACY_COLON, 0)
  }
  public legacyPlaceholderExpr(): LegacyPlaceholderExprContext | null {
    return this.getRuleContext(0, LegacyPlaceholderExprContext)
  }
  public override get ruleIndex(): number {
    return ExprParser.RULE_legacyExpr
  }
  public override enterRule(listener: ExprParserListener): void {
    if (listener.enterLegacyExpr) {
      listener.enterLegacyExpr(this)
    }
  }
  public override exitRule(listener: ExprParserListener): void {
    if (listener.exitLegacyExpr) {
      listener.exitLegacyExpr(this)
    }
  }
}

export class LegacyDataRefNameContext extends antlr.ParserRuleContext {
  public constructor(
    parent: antlr.ParserRuleContext | null,
    invokingState: number,
  ) {
    super(parent, invokingState)
  }
  public legacyRefObjectName(): LegacyRefObjectNameContext {
    return this.getRuleContext(0, LegacyRefObjectNameContext)!
  }
  public legacyRefAttrName(): LegacyRefAttrNameContext {
    return this.getRuleContext(0, LegacyRefAttrNameContext)!
  }
  public override get ruleIndex(): number {
    return ExprParser.RULE_legacyDataRefName
  }
  public override enterRule(listener: ExprParserListener): void {
    if (listener.enterLegacyDataRefName) {
      listener.enterLegacyDataRefName(this)
    }
  }
  public override exitRule(listener: ExprParserListener): void {
    if (listener.exitLegacyDataRefName) {
      listener.exitLegacyDataRefName(this)
    }
  }
}

export class LegacyRefObjectNameContext extends antlr.ParserRuleContext {
  public constructor(
    parent: antlr.ParserRuleContext | null,
    invokingState: number,
  ) {
    super(parent, invokingState)
  }
  public LEGACY_ID(): antlr.TerminalNode {
    return this.getToken(ExprParser.LEGACY_ID, 0)!
  }
  public override get ruleIndex(): number {
    return ExprParser.RULE_legacyRefObjectName
  }
  public override enterRule(listener: ExprParserListener): void {
    if (listener.enterLegacyRefObjectName) {
      listener.enterLegacyRefObjectName(this)
    }
  }
  public override exitRule(listener: ExprParserListener): void {
    if (listener.exitLegacyRefObjectName) {
      listener.exitLegacyRefObjectName(this)
    }
  }
}

export class LegacyRefAttrNameContext extends antlr.ParserRuleContext {
  public constructor(
    parent: antlr.ParserRuleContext | null,
    invokingState: number,
  ) {
    super(parent, invokingState)
  }
  public LEGACY_DOT(): antlr.TerminalNode[]
  public LEGACY_DOT(i: number): antlr.TerminalNode | null
  public LEGACY_DOT(
    i?: number,
  ): antlr.TerminalNode | null | antlr.TerminalNode[] {
    if (i === undefined) {
      return this.getTokens(ExprParser.LEGACY_DOT)
    } else {
      return this.getToken(ExprParser.LEGACY_DOT, i)
    }
  }
  public LEGACY_ID(): antlr.TerminalNode[]
  public LEGACY_ID(i: number): antlr.TerminalNode | null
  public LEGACY_ID(
    i?: number,
  ): antlr.TerminalNode | null | antlr.TerminalNode[] {
    if (i === undefined) {
      return this.getTokens(ExprParser.LEGACY_ID)
    } else {
      return this.getToken(ExprParser.LEGACY_ID, i)
    }
  }
  public LegacyIntegerLiteral(): antlr.TerminalNode[]
  public LegacyIntegerLiteral(i: number): antlr.TerminalNode | null
  public LegacyIntegerLiteral(
    i?: number,
  ): antlr.TerminalNode | null | antlr.TerminalNode[] {
    if (i === undefined) {
      return this.getTokens(ExprParser.LegacyIntegerLiteral)
    } else {
      return this.getToken(ExprParser.LegacyIntegerLiteral, i)
    }
  }
  public override get ruleIndex(): number {
    return ExprParser.RULE_legacyRefAttrName
  }
  public override enterRule(listener: ExprParserListener): void {
    if (listener.enterLegacyRefAttrName) {
      listener.enterLegacyRefAttrName(this)
    }
  }
  public override exitRule(listener: ExprParserListener): void {
    if (listener.exitLegacyRefAttrName) {
      listener.exitLegacyRefAttrName(this)
    }
  }
}

export class LegacyPlaceholderExprContext extends antlr.ParserRuleContext {
  public constructor(
    parent: antlr.ParserRuleContext | null,
    invokingState: number,
  ) {
    super(parent, invokingState)
  }
  public LegacyPlaceHolderModifierDate(): antlr.TerminalNode | null {
    return this.getToken(ExprParser.LegacyPlaceHolderModifierDate, 0)
  }
  public LegacyPlaceholderModifierFormat(): antlr.TerminalNode | null {
    return this.getToken(ExprParser.LegacyPlaceholderModifierFormat, 0)
  }
  public LegacyPlaceholderModifierJoin(): antlr.TerminalNode | null {
    return this.getToken(ExprParser.LegacyPlaceholderModifierJoin, 0)
  }
  public LegacyPlaceHolderModifierOffsetFormat(): antlr.TerminalNode | null {
    return this.getToken(ExprParser.LegacyPlaceHolderModifierOffsetFormat, 0)
  }
  public LEGACY_ARGS_COLON(): antlr.TerminalNode | null {
    return this.getToken(ExprParser.LEGACY_ARGS_COLON, 0)
  }
  public LegacyPlaceholderArgs(): antlr.TerminalNode | null {
    return this.getToken(ExprParser.LegacyPlaceholderArgs, 0)
  }
  public override get ruleIndex(): number {
    return ExprParser.RULE_legacyPlaceholderExpr
  }
  public override enterRule(listener: ExprParserListener): void {
    if (listener.enterLegacyPlaceholderExpr) {
      listener.enterLegacyPlaceholderExpr(this)
    }
  }
  public override exitRule(listener: ExprParserListener): void {
    if (listener.exitLegacyPlaceholderExpr) {
      listener.exitLegacyPlaceholderExpr(this)
    }
  }
}
