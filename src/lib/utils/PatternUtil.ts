import { format as formatDateTime, utcToZonedTime } from "date-fns-tz"
import {
  AttachmentContext,
  EnvContext,
  MessageContext,
  MetaInfo,
  ProcessingContext,
  ThreadContext,
} from "../Context"

enum PlaceholderModifierType {
  NONE = "",
  FORMAT = "format",
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

type Placeholder = {
  fullName: string
  type: string
  name: string
  modifier: string
  arg: string
  index: number
  length: number
}

const placeholderRegex =
  /\$\{(?<fullName>(?<type>[^\\.]+)\.(?<name>[^:}]+))(:(?<modifier>[^:}]+)(:(?<arg>[^}]+))?)?\}/g
export const defaultDateFormat = "yyyy-MM-dd HH:mm:ss"
export const defaultJoinSeparator = ","

export class PatternUtil {
  public static formatDate(date: Date, format: string, timezone = "UTC") {
    // See https://stackoverflow.com/questions/43525786/momentjs-convert-from-utc-to-desired-timezone-not-just-local
    const v = formatDateTime(utcToZonedTime(date, timezone), format)
    return v
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
    ctx:
      | EnvContext
      | ProcessingContext
      | ThreadContext
      | MessageContext
      | AttachmentContext,
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
        switch (value?.constructor?.name) {
          case "Array":
            if (Array.isArray(value)) {
              const separator =
                p.modifier === PlaceholderModifierType.JOIN
                  ? p.arg
                  : defaultJoinSeparator
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
            const format =
              p.modifier === PlaceholderModifierType.FORMAT
                ? p.arg
                : defaultDateFormat
            stringValue = this.formatDate(
              value as Date,
              format,
              ctx.env.timezone,
            )
            break
          }
          default:
            stringValue = JSON.stringify(value)
            break
        }
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

  public static substitute(
    ctx:
      | EnvContext
      | ProcessingContext
      | ThreadContext
      | MessageContext
      | AttachmentContext,
    s: string,
  ) {
    let p
    while ((p = PatternUtil.nextPlaceholder(s))) {
      const stringValue = this.valueToString(ctx, p)
      s = `${s.slice(0, p.index)}${stringValue}${s.slice(p.index + p.length)}`
    }
    return s
  }

  public static stringValue(
    ctx:
      | EnvContext
      | ProcessingContext
      | ThreadContext
      | MessageContext
      | AttachmentContext,
    key: string,
    m: MetaInfo = ctx.meta,
  ) {
    const stringValue = PatternUtil.valueToString(ctx, key, m)
    return stringValue
  }
}
