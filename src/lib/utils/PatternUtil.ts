import moment from "moment-timezone"
import {
  AttachmentContext,
  MessageContext,
  ProcessingContext,
  ThreadContext,
} from "../Context"

export enum PlaceholderModifierType {
  FORMAT = "format",
  DEFAULT = "",
}

export type Placeholder = {
  name: string
  modifier: string
  arg: string
  index: number
  length: number
}

const placeholderRegex =
  /\$\{(?<name>[^:}]+)(:(?<modifier>[^:}]+)(:(?<arg>[^}]+))?)?\}/g

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

  public static substitute(
    ctx: ProcessingContext | ThreadContext | MessageContext | AttachmentContext,
    s: string,
  ) {
    let p
    while ((p = PatternUtil.nextPlaceholder(s))) {
      const value = ctx.meta.get(p.name)
      let stringValue: string
      switch (typeof value) {
        case "object":
          switch (value?.constructor?.name) {
            case "Date":
              switch (p.modifier) {
                case PlaceholderModifierType.FORMAT:
                  stringValue = this.formatDate(
                    value as Date,
                    p.arg,
                    ctx.env.timezone,
                  )
                  break
                default:
                  stringValue = String(value)
                  break
              }
              break
            default:
              stringValue = JSON.stringify(value)
              break
          }
          break
        case "string":
          stringValue = value
          break
        case "undefined":
          stringValue = "undefined"
          break
        default:
          stringValue = String(value)
          break
      }
      s = `${s.slice(0, p.index)}${stringValue}${s.slice(p.index + p.length)}`
    }
    return s
  }
}
