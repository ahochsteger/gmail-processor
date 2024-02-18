import {
  AttachmentContext,
  Context,
  MessageContext,
  MetaInfo,
  ProcessingContext,
  ThreadContext,
} from "../Context"
import { DateUtils, defaultDateFormat } from "./DateUtils"

/**
 * The modifiers for placeholder expressions.
 */
export enum PlaceholderModifierType {
  /**
   * The `date` placeholder modifier converts the value of the given placeholder to a `Date` and allows date/time calculations on it.
   *
   * Syntax: `${<placeholder>:date:[[<date-expression>][:<format>]]}`
   * * `<date-expression> = [<date-fns-function>][<+/-><parse-duration>]`: If no expression is given, the date of the placeholder is used unmodified.
   * * `<date-fns-function>`: a supported [`date-fns` function](https://date-fns.org/docs/format) as defined by the constant [`DATE_FNS_FUNCTIONS` in DateUtils.ts](https://github.com/ahochsteger/gmail-processor/blob/main/src/lib/utils/DateUtils.ts)
   * * `<parse-duration>`: a relative duration in the form of a [parse-duration format string](https://github.com/jkroso/parse-duration#api)
   * * `<format>`: Format the resulting date/time using a [date-fns format string](https://date-fns.org/docs/format). If no format is given the setting `defaultTimestampFormat` is used.
   *
   * Examples:
   * * `${message.date:date:lastDayOfMonth-1d:yyyy-MM-DD}`: evaluates to the 2nd last day of the month in which the message has been sent.
   * * `${message.body.match.invoiceDate:date:startOfMonth+4d+1month:yyyy-MM-DD}`: evaluates to the 5th day of the month following the invoice date (extracted using a regex from the message body)
   */
  DATE = "date",
  /**
   * Use `${<placeholder>:format:<format>}` to format the date/time using a [date-fns format string](https://date-fns.org/docs/format).
   * @deprecated Use `${<placeholder>:date::<format>}` instead. Note the double colon if no date modification expression is required.
   */
  FORMAT = "format",
  /**
   * Use `${<placeholder>:join[:<separator>]}` to join the values of an array into a string (default: `,`).
   */
  JOIN = "join",
  /** No modifier */
  NONE = "",
  /**
   * Use `${<placeholder>:offset-format:<offset>:<format>}` to calculate the date/time offset using a [parse-duration format string](https://github.com/jkroso/parse-duration#parsestr-formatms) and then format the resulting date/time using a [date-fns format strings](https://date-fns.org/docs/format).
   * @deprecated Use `${<placeholder>:date:<offset>[:<format>]}` instead.
   */
  OFFSET_FORMAT = "offset-format",
  /**
   * Unsupported placeholder modifier type given.
   */
  UNSUPPORTED = "unsupported",
}

/** The type of a placeholder. */
export enum PlaceholderType {
  /** An attachment placeholder type. */
  ATTACHMENT = "attachment",
  /** A message placeholder type. */
  MESSAGE = "message",
  /** A thread placeholder type. */
  THREAD = "thread",
}

export type Placeholder = {
  fullName: string
  type: string
  name: string
  modifier: PlaceholderModifierType
  arg: string
  index: number
  length: number
  raw: string
}

// NOTE: The character limitations in the regex are present to prevent ReDos attacks.
// See https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS
const placeholderRegex =
  /\$\{(?<raw>(?<fullName>(?<type>[^\\.]{1,16})\.(?<name>[^:}]{1,32}))(:(?<modifier>[^:}]{1,16})(:(?<arg>[^}]{1,1000}))?)?)\}/g
const defaultJoinSeparator = ","

export class PatternUtil {
  public static getDefaultDateFormat(ctx: Context) {
    return (
      (ctx as ProcessingContext).proc?.config.settings
        .defaultArrayJoinSeparator ?? defaultJoinSeparator
    )
  }
  public static getDefaultArraySeparator(ctx: Context) {
    return (
      (ctx as ProcessingContext).proc?.config.settings.defaultTimestampFormat ??
      defaultDateFormat
    )
  }
  public static nextPlaceholder(s: string): Placeholder | undefined {
    placeholderRegex.lastIndex = 0 // Reset lastIndex to always start from the beginning
    const match = placeholderRegex.exec(s)
    if (!match?.groups) return
    let modifier = PlaceholderModifierType.NONE
    if (match.groups.modifier) {
      if (
        (Object.values(PlaceholderModifierType) as string[]).includes(
          match.groups.modifier,
        )
      ) {
        modifier = match.groups.modifier as PlaceholderModifierType
      } else {
        modifier = PlaceholderModifierType.UNSUPPORTED
      }
    }

    return {
      fullName: match.groups.fullName ?? "",
      type: match.groups.type ?? "",
      name: match.groups.name ?? "",
      modifier: modifier,
      arg: match.groups.arg ?? "",
      index: match.index,
      length: match[0].length,
      raw: match.groups.raw,
    }
  }

  /**
   * Converts the type of a value to one that can be further processed.
   * It handles the following cases:
   * * Functions are converted to their function values
   * * Special modifier conversions (like `date`) are applied
   */
  public static convertType(
    ctx: Context,
    p: Placeholder,
    value: unknown,
  ): unknown {
    if (typeof value === "function") {
      switch (p.type) {
        case PlaceholderType.THREAD:
          value = value.apply(this, [(ctx as ThreadContext).thread.object])
          break
        case PlaceholderType.MESSAGE:
          value = value.apply(this, [(ctx as MessageContext).message.object])
          break
        case PlaceholderType.ATTACHMENT:
          value = value.apply(this, [
            (ctx as AttachmentContext).attachment.object,
          ])
          break
        default:
          value = value.apply(this, [])
          break
      }
    }
    if (
      p.modifier === PlaceholderModifierType.DATE &&
      (typeof value === "number" || typeof value === "string")
    ) {
      value = new Date(value)
    }
    return value
  }

  public static valueToString(
    ctx: Context,
    ref: Placeholder | string,
    m: MetaInfo = ctx.meta,
    defaultValue = "",
  ): string {
    let stringValue = defaultValue
    let p: Placeholder | undefined
    if (typeof ref === "string") {
      // Turn placeholder name into placeholder type
      p = PatternUtil.nextPlaceholder(`\${${ref}}`)
    } else {
      // Already got a placeholder type
      p = ref
    }
    if (p?.modifier === PlaceholderModifierType.UNSUPPORTED) {
      ctx.log.warn(`Unsupported placeholder modifier in expression '${p.raw}'!`)
      return p.raw
    }

    if (!p || !m[p.fullName]) return defaultValue
    let value = m[p.fullName].value

    // Conversion to final data type:
    value = this.convertType(ctx, p, value)

    // Type-dependent processing:
    switch (typeof value) {
      // TODO: Add support for boolean, number, bigint, symbol, function
      case "object":
        stringValue = PatternUtil.objectValueToString(
          ctx,
          p,
          value,
          defaultValue,
        )
        break
      case "string":
        stringValue = value
        break
      case "undefined":
        ctx.log.warn(`Placeholder '${p.fullName}' value is undefined!`)
        break
      default:
        stringValue = String(value)
        break
    }
    return stringValue
  }

  private static objectValueToString(
    ctx: Context,
    p: Placeholder,
    value: object | null,
    defaultValue: string,
  ) {
    let stringValue = defaultValue
    switch (value?.constructor?.name) {
      case "Array":
        if (Array.isArray(value)) {
          const separator =
            p.modifier === PlaceholderModifierType.JOIN
              ? p.arg
              : PatternUtil.getDefaultArraySeparator(ctx)
          stringValue = value.join(separator) // TODO: Maybe recursively evaluate each value before joining
        } else {
          ctx.log.warn(
            `Placeholder '${
              p.fullName
            }' array cannot be converted to string (value: ${JSON.stringify(
              value,
            )})!`,
          )
        }
        break
      case "Date": {
        stringValue = DateUtils.evaluate(p.modifier, p.arg, value as Date)
        break
      }
      default:
        stringValue = JSON.stringify(value)
        break
    }
    return stringValue
  }

  public static substitute(ctx: Context, s: string) {
    let p
    while ((p = PatternUtil.nextPlaceholder(s))) {
      const stringValue = this.valueToString(ctx, p)
      s = `${s.slice(0, p.index)}${stringValue}${s.slice(p.index + p.length)}`
    }
    return s
  }

  public static stringValue(ctx: Context, key: string, m: MetaInfo = ctx.meta) {
    const stringValue = PatternUtil.valueToString(ctx, key, m)
    return stringValue
  }
}
