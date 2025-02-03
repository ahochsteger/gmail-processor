import {
  ATNSimulator,
  BaseErrorListener,
  CharStream,
  CommonTokenStream,
  ErrorNode,
  ParserRuleContext,
  ParseTreeWalker,
  RecognitionException,
  Recognizer,
  Token,
} from "antlr4ng"
import { format } from "date-fns"
import { AttachmentContext, MessageContext, ThreadContext } from "../Context"
import { Context, MetaInfo } from "./../Context"
import { defaultDateFormat, executeFilter } from "./ExprFilter"
import { ExprLexer } from "./generated/ExprLexer"
import {
  DataRefNameContext,
  ExprContext,
  ExprParser,
  FilterArgContext,
  FilterExprContext,
  FilterNameContext,
  LegacyDataRefNameContext,
  LegacyExprContext,
  LegacyPlaceholderExprContext,
  TemplateContext,
  TextContext,
} from "./generated/ExprParser"
import { ExprParserListener } from "./generated/ExprParserListener"

export type DateType = Date | number | string
export type ValueBaseType = string | boolean | number | DateType
export type ValueType = ValueBaseType | ValueBaseType[] | undefined

// type FilterFunction = (value: ValueType, ...args: ValueType[]) => ValueType

export interface ExprState {
  value?: ValueType
  template: string
  filterArgs: ValueType[]
}

export interface Contexts {
  data: MetaInfo
  gmailProcessor: Context
  parseRoot?: TemplateContext
  parseCurrent?: ParserRuleContext
}

export class ExprListener extends ExprParserListener {
  private value?: ValueType
  private result: string
  private filterArgs: ValueType[] = []
  private ctxs: Contexts
  constructor(
    gpCtx: Context,
    private defaultValue: string = "",
    data: MetaInfo = gpCtx.meta,
  ) {
    super()
    this.result = defaultValue
    this.ctxs = {
      data: data,
      gmailProcessor: gpCtx,
    }
  }

  public getResult(): string {
    return this.result
  }
  enterTemplate = (ctx: TemplateContext) => {
    this.ctxs.parseRoot = ctx
    this.ctxs.parseCurrent = ctx
  }
  exitText = (ctx: TextContext) => {
    this.ctxs.parseCurrent = ctx
    this.result += ctx.getText()
  }
  exitDataRefName = (ctx: DataRefNameContext) => {
    this.ctxs.parseCurrent = ctx

    this.value = ExprEvaluator.getContextValue(
      this.ctxs,
      ctx.getText(),
      this.defaultValue,
    )
  }
  exitFilterName = (ctx: FilterNameContext) => {
    this.ctxs.parseCurrent = ctx
    this.filterArgs = []
  }
  getArgValue(ctx: FilterArgContext): ValueType {
    const text = ctx.getText()
    if (ctx.BooleanLiteral()) {
      return Boolean(text)
    } else if (ctx.IntegerLiteral()) {
      return Number(text)
    } else if (ctx.STRING()) {
      return text.slice(1, -1)
    } else {
      throw new Error(`Unsupported filter argument type: ${text}`)
    }
  }
  exitFilterArg = (ctx: FilterArgContext) => {
    this.ctxs.parseCurrent = ctx
    this.filterArgs.push(this.getArgValue(ctx))
  }
  exitFilterExpr = (ctx: FilterExprContext) => {
    this.ctxs.parseCurrent = ctx
    this.value = executeFilter(
      ctx.filterName().getText(),
      this.value,
      ...this.filterArgs,
    )
  }
  exitExpr = (ctx: ExprContext) => {
    this.ctxs.parseCurrent = ctx
    this.result += ExprEvaluator.anyValueToString(this.ctxs, this.value)
  }
  exitLegacyPlaceholderExpr = (ctx: LegacyPlaceholderExprContext) => {
    this.ctxs.parseCurrent = ctx
    const args: string | undefined = ctx.LegacyPlaceholderArgs()?.getText()
    if (
      ctx.LegacyPlaceHolderModifierDate() ||
      ctx.LegacyPlaceHolderModifierOffsetFormat()
    ) {
      const [offset, format] = (args ?? "").split(":")
      this.value = executeFilter("offsetDate", this.value, offset)
      this.value = executeFilter("formatDate", this.value, format)
    }
    if (ctx.LegacyPlaceholderModifierFormat()) {
      this.value = executeFilter("formatDate", this.value, args)
    }
    if (ctx.LegacyPlaceholderModifierJoin()) {
      this.value = executeFilter("join", this.value, args ?? ",")
    }
  }
  exitLegacyDataRefName = (ctx: LegacyDataRefNameContext) => {
    this.ctxs.parseCurrent = ctx

    this.value = ExprEvaluator.getContextValue(
      this.ctxs,
      ctx.getText(),
      this.defaultValue,
    )
  }
  exitLegacyExpr = (ctx: LegacyExprContext) => {
    this.ctxs.parseCurrent = ctx
    this.result += ExprEvaluator.anyValueToString(this.ctxs, this.value)
  }
  visitErrorNode(node: ErrorNode): void {
    throw new Error(
      `Error parsing '${node.getText()}' in expression '${this.ctxs.parseRoot?.getText()}'`,
    )
  }
}

export class ExprErrorListener extends BaseErrorListener {
  syntaxError<S extends Token, T extends ATNSimulator>(
    _recognizer: Recognizer<T>,
    _offendingSymbol: S | null,
    line: number,
    column: number,
    msg: string,
    e: RecognitionException | null,
  ): void {
    throw new SyntaxError(`${msg} at line ${line} and column ${column}`, {
      cause: e,
    })
  }
}

export class ExprEvaluator {
  public static anyValueToString(
    ctxs: Contexts,
    value: unknown,
    defaultValue: string = "",
  ): string {
    let stringValue = ""
    switch (typeof value) {
      // TODO: Add support for boolean, number, bigint, symbol, function
      case "object":
        stringValue = this.objectValueToString(value, defaultValue)
        break
      case "string":
        stringValue = value
        break
      case "undefined":
        ctxs.gmailProcessor.log.warn(
          `About to process an undefined value with '${ctxs.parseCurrent?.getText()}' '${ctxs.parseRoot?.getText()}' value is undefined!`,
        )
        break
      default:
        stringValue = String(value)
        break
    }
    return stringValue
  }
  public static objectValueToString(
    value: object | null,
    defaultValue: string,
  ): string {
    let stringValue = defaultValue
    switch (value?.constructor.name) {
      case "Array":
        stringValue =
          (executeFilter("join", value as ValueType) as string | undefined) ??
          defaultValue
        // this.evaluateJoinExpression(ctxs, value as ValueBaseType[], ",") ??
        // defaultValue
        break
      case "Date": {
        stringValue = format(value as Date, defaultDateFormat)
        break
      }
      default:
        stringValue = JSON.stringify(value)
        break
    }
    return stringValue
  }
  public static getContextValue(
    ctxs: Contexts,
    refName: string,
    defaultValue: string = "",
  ): ValueType {
    const ctx = ctxs.gmailProcessor
    const objRef = refName.split(".")[0]
    let value:
      | ValueType
      | unknown
      | ((
          obj?:
            | GoogleAppsScript.Gmail.GmailThread
            | GoogleAppsScript.Gmail.GmailMessage
            | GoogleAppsScript.Gmail.GmailAttachment,
        ) => ValueType) = ctxs.data[refName]?.value ?? defaultValue
    if (typeof value === "function") {
      switch (objRef) {
        case "thread":
          value = value.apply(this, [(ctx as ThreadContext).thread.object])
          break
        case "message":
          value = value.apply(this, [(ctx as MessageContext).message.object])
          break
        case "attachment":
          value = value.apply(this, [
            (ctx as AttachmentContext).attachment.object,
          ])
          break
        default:
          value = value.apply(this, [])
          break
      }
    }
    return value as ValueType
  }

  public static parse(expr: string): TemplateContext {
    const inputStream = CharStream.fromString(expr)
    const lexer = new ExprLexer(inputStream)
    const tokenStream = new CommonTokenStream(lexer)
    const parser = new ExprParser(tokenStream)
    const errorListener = new ExprErrorListener()
    parser.addErrorListener(errorListener)
    parser.buildParseTrees = true
    let ctx: TemplateContext
    try {
      ctx = parser.template()
    } catch (e) {
      throw new SyntaxError(`${e?.toString()} in expression: ${expr}`, {
        cause: e,
      })
    }
    return ctx
  }

  public static evaluate(
    ctx: Context,
    expr: string,
    m: MetaInfo = ctx.meta,
    defaultValue: string = "",
  ): string {
    const tree = this.parse(expr)
    const listener = new ExprListener(ctx, defaultValue, m)
    ParseTreeWalker.DEFAULT.walk(listener, tree)
    const value = listener.getResult()
    if (typeof value !== "string") {
      throw new Error(`Error evaluating expression: ${expr}`)
    }
    return value
  }
}
