import {
  AttachmentContext,
  Context,
  MessageContext,
  MetaInfo,
  ProcessingContext,
  ThreadContext,
} from "../Context"
import {
  DatePlaceholderModifierType,
  DateUtils,
  defaultDateFormat,
} from "./DateUtils"

/**
 * The modifiers for placeholder expressions.
 */
export enum ArrayPlaceholderModifierType {
  /**
   * Use \`$\{<key>:join:<string>\}\` to join the values of an array (default: `,`).
   */
  JOIN = "join",
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
  modifier: string
  arg: string
  index: number
  length: number
}

// NOTE: The character limitations in the regex are present to prevent ReDos attacks.
// See https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS
const placeholderRegex =
  /\$\{(?<fullName>(?<type>[^\\.]{1,16})\.(?<name>[^:}]{1,32}))(:(?<modifier>[^:}]{1,16})(:(?<arg>[^}]{1,1000}))?)?\}/g
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
    return {
      fullName: match.groups?.fullName ?? "",
      type: match.groups?.type ?? "",
      name: match.groups?.name ?? "",
      modifier: match.groups?.modifier ?? "",
      arg: match.groups?.arg ?? "",
      index: match.index,
      length: match[0].length,
    }
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
    if (!p || !m[p.fullName]) return defaultValue
    let value = m[p.fullName].value
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
    switch (typeof value) {
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
            p.modifier === ArrayPlaceholderModifierType.JOIN
              ? p.arg
              : PatternUtil.getDefaultArraySeparator(ctx)
          stringValue = value.join(separator)
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
        stringValue = DateUtils.evaluate(
          p.modifier as DatePlaceholderModifierType,
          p.arg,
          value as Date,
        )
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
