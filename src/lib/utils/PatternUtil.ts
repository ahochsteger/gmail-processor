import moment from "moment-timezone"
import {
  AttachmentContext,
  MessageContext,
  ProcessingContext,
  ThreadContext,
} from "../Context"

enum PlaceholderModifierType {
  FORMAT = "format",
  DEFAULT = "",
}

type Placeholder = {
  name: string
  modifier: string
  arg: string
  index: number
  length: number
}

const placeholderRegex =
  /\$\{(?<name>[^:}]+)(:(?<modifier>[^:}]+)(:(?<arg>[^}]+))?)?\}/g
export const defaultDateFormat = "YYYY-MM-DD HH:mm:ss"

export class PatternUtil {
  public static formatDate(date: Date, format: string, timezone = "UTC") {
    // See https://stackoverflow.com/questions/43525786/momentjs-convert-from-utc-to-desired-timezone-not-just-local
    const v = moment(date).tz(timezone).format(format)
    return v
  }

  public static nextPlaceholder(s: string): Placeholder | undefined {
    placeholderRegex.lastIndex = 0 // Reset lastIndex to always start from the beginning
    const match = placeholderRegex.exec(s)
    if (!match || !match.groups) return
    return {
      name: match.groups?.name ?? "",
      modifier: match.groups?.modifier ?? "",
      arg: match.groups?.arg ?? "",
      index: match.index,
      length: match[0].length,
    }
  }

  public static valueToString(
    ctx: ProcessingContext | ThreadContext | MessageContext | AttachmentContext,
    p: Placeholder,
    value: unknown,
  ): string {
    let stringValue = ""
    if (typeof value === "function") {
      value = value.apply(this)
    }
    switch (typeof value) {
      case "object":
        switch (value?.constructor?.name) {
          case "Array":
            if (Array.isArray(value)) {
              stringValue = value.join(",")
            } else {
              ctx.log.warn(
                `Placeholder '${
                  p.name
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
        ctx.log.warn(`Placeholder '${p.name}' value is undefined!`)
        break
      default:
        stringValue = String(value)
        break
    }
    return stringValue
  }

  public static substitute(
    ctx: ProcessingContext | ThreadContext | MessageContext | AttachmentContext,
    s: string,
  ) {
    let p
    while ((p = PatternUtil.nextPlaceholder(s))) {
      const value = ctx.meta[p.name].value
      const stringValue = this.valueToString(ctx, p, value)
      s = `${s.slice(0, p.index)}${stringValue}${s.slice(p.index + p.length)}`
    }
    return s
  }
}
