import { ProcessingContext } from "../Context"

/**
 * Utility class for regular expression operations.
 */
export class RegexUtils {
  /**
   * Escapes a string for use in a regular expression.
   * This is a polyfill for the upcoming RegExp.escape() standard.
   * @param str - The string to escape.
   * @returns The escaped string.
   */
  public static escape(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  public static matchRegExp(
    regex: string,
    str: string | undefined,
    flags = "",
  ): RegExpExecArray | null {
    const inlineModifierRegExp = /^\(\?(?<flags>[gimsuy]+)\)/
    const res = inlineModifierRegExp.exec(regex)
    if (res) {
      const len = res[0].length
      regex = regex.slice(len)
    }
    return RegExp(regex, flags + (res?.groups?.flags ?? "")).exec(str ?? "")
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
