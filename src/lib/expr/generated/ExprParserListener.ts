/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  ErrorNode,
  ParseTreeListener,
  ParserRuleContext,
  TerminalNode,
} from "antlr4ng"

import {
  DataRefNameContext,
  ExprContext,
  FilterArgContext,
  FilterArgsContext,
  FilterChainContext,
  FilterExprContext,
  FilterNameContext,
  LegacyDataRefNameContext,
  LegacyExprContext,
  LegacyPlaceholderExprContext,
  LegacyRefAttrNameContext,
  LegacyRefObjectNameContext,
  RefAttrNameContext,
  RefObjectNameContext,
  TemplateContext,
  TemplatePartContext,
  TextContext,
} from "./ExprParser.js"

/**
 * This interface defines a complete listener for a parse tree produced by
 * `ExprParser`.
 */
export class ExprParserListener implements ParseTreeListener {
  /**
   * Enter a parse tree produced by `ExprParser.template`.
   * @param ctx the parse tree
   */
  enterTemplate?: (ctx: TemplateContext) => void
  /**
   * Exit a parse tree produced by `ExprParser.template`.
   * @param ctx the parse tree
   */
  exitTemplate?: (ctx: TemplateContext) => void
  /**
   * Enter a parse tree produced by `ExprParser.templatePart`.
   * @param ctx the parse tree
   */
  enterTemplatePart?: (ctx: TemplatePartContext) => void
  /**
   * Exit a parse tree produced by `ExprParser.templatePart`.
   * @param ctx the parse tree
   */
  exitTemplatePart?: (ctx: TemplatePartContext) => void
  /**
   * Enter a parse tree produced by `ExprParser.text`.
   * @param ctx the parse tree
   */
  enterText?: (ctx: TextContext) => void
  /**
   * Exit a parse tree produced by `ExprParser.text`.
   * @param ctx the parse tree
   */
  exitText?: (ctx: TextContext) => void
  /**
   * Enter a parse tree produced by `ExprParser.expr`.
   * @param ctx the parse tree
   */
  enterExpr?: (ctx: ExprContext) => void
  /**
   * Exit a parse tree produced by `ExprParser.expr`.
   * @param ctx the parse tree
   */
  exitExpr?: (ctx: ExprContext) => void
  /**
   * Enter a parse tree produced by `ExprParser.dataRefName`.
   * @param ctx the parse tree
   */
  enterDataRefName?: (ctx: DataRefNameContext) => void
  /**
   * Exit a parse tree produced by `ExprParser.dataRefName`.
   * @param ctx the parse tree
   */
  exitDataRefName?: (ctx: DataRefNameContext) => void
  /**
   * Enter a parse tree produced by `ExprParser.refObjectName`.
   * @param ctx the parse tree
   */
  enterRefObjectName?: (ctx: RefObjectNameContext) => void
  /**
   * Exit a parse tree produced by `ExprParser.refObjectName`.
   * @param ctx the parse tree
   */
  exitRefObjectName?: (ctx: RefObjectNameContext) => void
  /**
   * Enter a parse tree produced by `ExprParser.refAttrName`.
   * @param ctx the parse tree
   */
  enterRefAttrName?: (ctx: RefAttrNameContext) => void
  /**
   * Exit a parse tree produced by `ExprParser.refAttrName`.
   * @param ctx the parse tree
   */
  exitRefAttrName?: (ctx: RefAttrNameContext) => void
  /**
   * Enter a parse tree produced by `ExprParser.filterChain`.
   * @param ctx the parse tree
   */
  enterFilterChain?: (ctx: FilterChainContext) => void
  /**
   * Exit a parse tree produced by `ExprParser.filterChain`.
   * @param ctx the parse tree
   */
  exitFilterChain?: (ctx: FilterChainContext) => void
  /**
   * Enter a parse tree produced by `ExprParser.filterExpr`.
   * @param ctx the parse tree
   */
  enterFilterExpr?: (ctx: FilterExprContext) => void
  /**
   * Exit a parse tree produced by `ExprParser.filterExpr`.
   * @param ctx the parse tree
   */
  exitFilterExpr?: (ctx: FilterExprContext) => void
  /**
   * Enter a parse tree produced by `ExprParser.filterName`.
   * @param ctx the parse tree
   */
  enterFilterName?: (ctx: FilterNameContext) => void
  /**
   * Exit a parse tree produced by `ExprParser.filterName`.
   * @param ctx the parse tree
   */
  exitFilterName?: (ctx: FilterNameContext) => void
  /**
   * Enter a parse tree produced by `ExprParser.filterArgs`.
   * @param ctx the parse tree
   */
  enterFilterArgs?: (ctx: FilterArgsContext) => void
  /**
   * Exit a parse tree produced by `ExprParser.filterArgs`.
   * @param ctx the parse tree
   */
  exitFilterArgs?: (ctx: FilterArgsContext) => void
  /**
   * Enter a parse tree produced by `ExprParser.filterArg`.
   * @param ctx the parse tree
   */
  enterFilterArg?: (ctx: FilterArgContext) => void
  /**
   * Exit a parse tree produced by `ExprParser.filterArg`.
   * @param ctx the parse tree
   */
  exitFilterArg?: (ctx: FilterArgContext) => void
  /**
   * Enter a parse tree produced by `ExprParser.legacyExpr`.
   * @param ctx the parse tree
   */
  enterLegacyExpr?: (ctx: LegacyExprContext) => void
  /**
   * Exit a parse tree produced by `ExprParser.legacyExpr`.
   * @param ctx the parse tree
   */
  exitLegacyExpr?: (ctx: LegacyExprContext) => void
  /**
   * Enter a parse tree produced by `ExprParser.legacyDataRefName`.
   * @param ctx the parse tree
   */
  enterLegacyDataRefName?: (ctx: LegacyDataRefNameContext) => void
  /**
   * Exit a parse tree produced by `ExprParser.legacyDataRefName`.
   * @param ctx the parse tree
   */
  exitLegacyDataRefName?: (ctx: LegacyDataRefNameContext) => void
  /**
   * Enter a parse tree produced by `ExprParser.legacyRefObjectName`.
   * @param ctx the parse tree
   */
  enterLegacyRefObjectName?: (ctx: LegacyRefObjectNameContext) => void
  /**
   * Exit a parse tree produced by `ExprParser.legacyRefObjectName`.
   * @param ctx the parse tree
   */
  exitLegacyRefObjectName?: (ctx: LegacyRefObjectNameContext) => void
  /**
   * Enter a parse tree produced by `ExprParser.legacyRefAttrName`.
   * @param ctx the parse tree
   */
  enterLegacyRefAttrName?: (ctx: LegacyRefAttrNameContext) => void
  /**
   * Exit a parse tree produced by `ExprParser.legacyRefAttrName`.
   * @param ctx the parse tree
   */
  exitLegacyRefAttrName?: (ctx: LegacyRefAttrNameContext) => void
  /**
   * Enter a parse tree produced by `ExprParser.legacyPlaceholderExpr`.
   * @param ctx the parse tree
   */
  enterLegacyPlaceholderExpr?: (ctx: LegacyPlaceholderExprContext) => void
  /**
   * Exit a parse tree produced by `ExprParser.legacyPlaceholderExpr`.
   * @param ctx the parse tree
   */
  exitLegacyPlaceholderExpr?: (ctx: LegacyPlaceholderExprContext) => void

  visitTerminal(_node: TerminalNode): void {}
  visitErrorNode(_node: ErrorNode): void {}
  enterEveryRule(_node: ParserRuleContext): void {}
  exitEveryRule(_node: ParserRuleContext): void {}
}
