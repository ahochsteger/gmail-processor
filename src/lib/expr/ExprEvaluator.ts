import parseDuration from "parse-duration"
import { Context, MetaInfo, ProcessingContext } from "./../Context"
/* eslint-disable @typescript-eslint/no-extraneous-class */
import {
  CharStream,
  CommonTokenStream,
  ErrorNode,
  ParserRuleContext,
  ParseTreeWalker,
} from "antlr4ng"
import { addMilliseconds, format, parse } from "date-fns"
import { AttachmentContext, MessageContext, ThreadContext } from "../Context"
import { defaultDateFormat, getDateFnInfo } from "../utils/DateExpression"
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

interface Contexts {
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
    this.value = ExpressionFilter.execute(
      this.ctxs,
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
    if (ctx.LegacyPlaceHolderModifierOffsetFormat()) {
      this.value = ExpressionFilter.execute(
        this.ctxs,
        "offsetDate",
        this.value,
        ctx.LegacyPlaceHolderModifierOffsetFormat()?.getText(),
      )
    }
    if (ctx.LegacyPlaceholderModifierFormat()) {
      this.value = ExpressionFilter.execute(
        this.ctxs,
        "formatDate",
        this.value,
        ctx.LegacyPlaceholderModifierFormat()?.getText(),
      )
    }
    if (ctx.LegacyPlaceholderModifierJoin()) {
      this.value = ExpressionFilter.execute(
        this.ctxs,
        "join",
        this.value,
        ctx.LegacyPlaceholderArgs()?.getText() ?? ",",
      )
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

class ExpressionFilter {
  public static asType<T>(v: ValueType): T {
    return v as T
  }
  public static execute(
    ctxs: Contexts,
    name: string,
    value: ValueType,
    ...args: ValueType[]
  ): ValueType {
    //console.log(name, value, args)
    switch (name) {
      case "formatDate":
        {
          // TODO: Assert DateType
          const fmt: string =
            (args[0] ?? "") != "" ? (args[0] as string) : defaultDateFormat
          value = format(value as Date, fmt)
        }
        break
      case "join":
        ExprEvaluator.evaluateJoinExpression(
          ctxs,
          value as ValueBaseType[],
          args[0] as string,
        )
        break
      case "offsetDate":
        {
          // TODO: Assert DateType
          const fmt = args[0] as string
          const durationValue = parseDuration(fmt)
          if (!durationValue) {
            throw new Error(`ERROR: Cannot parse date offset: ${fmt}`)
          }
          value = addMilliseconds(value as DateType, durationValue)
        }
        break
      case "parseDate":
        // TODO: Assert string type
        value = parse(value as string, args[0] as string, new Date())
        break
      default:
        // TODO: Assert DateType
        const fnInfo = getDateFnInfo(name)
        if (!fnInfo) {
          throw new Error(`Unknown function '${name}'`)
        }
        value = fnInfo.fn(value as Date)
        break
    }
    return value
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
        stringValue = this.objectValueToString(ctxs, value, defaultValue)
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
  public static evaluateJoinExpression(
    ctxs: Contexts,
    value: ValueBaseType[],
    separator?: string,
  ): string | undefined {
    if (Array.isArray(value)) {
      separator =
        separator ??
        (ctxs.gmailProcessor as ProcessingContext).proc.config.settings
          .defaultArrayJoinSeparator
      return value.join(separator) // TODO: Maybe recursively evaluate each value before joining
    } else {
      ctxs.gmailProcessor.log.warn(
        `Non-array type cannot be converted to string during ${ctxs.parseCurrent?.getText()} with value: ${JSON.stringify(
          value,
        )}`,
      )
    }
  }
  public static objectValueToString(
    ctxs: Contexts,
    value: object | null,
    defaultValue: string,
  ): string {
    let stringValue = defaultValue
    switch (value?.constructor.name) {
      case "Array":
        stringValue =
          this.evaluateJoinExpression(ctxs, value as ValueBaseType[], ",") ??
          defaultValue
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

  public static parse(expr: string) {
    const inputStream = CharStream.fromString(expr)
    const lexer = new ExprLexer(inputStream)
    const tokenStream = new CommonTokenStream(lexer)
    const parser = new ExprParser(tokenStream)
    parser.buildParseTrees = true
    const tree = parser.template()
    return tree
  }

  public static evaluate(
    ctx: Context,
    expr: string,
    m: MetaInfo = ctx.meta,
    defaultValue: string = "",
  ): string {
    //ctx.log.debug(`Evaluating expression '${expr}' ...`)
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
