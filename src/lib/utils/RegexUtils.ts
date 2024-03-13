import { ProcessingContext } from "../Context"

export class RegexUtils {
  public static matchRegExp(regex: string, str: string, flags = "") {
    const inlineModifierRegExp = /^\(\?(?<flags>[gimsuy]+)\)/
    const res = inlineModifierRegExp.exec(regex)
    if (res) {
      const len = res[0].length
      regex = regex.slice(len)
    }
    return RegExp(regex, flags + (res?.groups?.flags ?? "")).exec(str)
  }

  public static matchError(ctx: ProcessingContext, message: string): boolean {
    ctx.log.warn(`MATCH ERROR: ${message}`)
    return false
  }

  public static noMatch(ctx: ProcessingContext, message: string): boolean {
    ctx.log.debug(`NO MATCH: ${message}`)
    return false
  }
}
