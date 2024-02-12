import {
  addMilliseconds,
  endOfDay,
  endOfHour,
  endOfISOWeek,
  endOfISOWeekYear,
  endOfMinute,
  endOfMonth,
  endOfQuarter,
  endOfSecond,
  endOfToday,
  endOfTomorrow,
  endOfYear,
  endOfYesterday,
  format,
  lastDayOfDecade,
  lastDayOfISOWeek,
  lastDayOfISOWeekYear,
  lastDayOfMonth,
  lastDayOfYear,
  nextFriday,
  nextMonday,
  nextSaturday,
  nextSunday,
  nextThursday,
  nextTuesday,
  nextWednesday,
  previousFriday,
  previousMonday,
  previousSaturday,
  previousSunday,
  previousThursday,
  previousTuesday,
  previousWednesday,
  startOfDay,
  startOfDecade,
  startOfHour,
  startOfISOWeek,
  startOfISOWeekYear,
  startOfMinute,
  startOfMonth,
  startOfQuarter,
  startOfSecond,
  startOfToday,
  startOfTomorrow,
  startOfYear,
  startOfYesterday,
} from "date-fns"
import parse from "parse-duration"

export const defaultDateFormat = "yyyy-MM-dd HH:mm:ss"
type ModDateType = (d: Date) => Date
type NewDateType = () => Date
export type ExprInfoType = {
  type: "mod" | "new"
  fn: ModDateType | NewDateType
}
export const DATE_EXPRESSIONS: Record<string, ExprInfoType> = {
  endOfToday: { type: "new", fn: endOfToday },
  endOfTomorrow: { type: "new", fn: endOfTomorrow },
  endOfYesterday: { type: "new", fn: endOfYesterday },
  startOfToday: { type: "new", fn: startOfToday },
  startOfTomorrow: { type: "new", fn: startOfTomorrow },
  startOfYesterday: { type: "new", fn: startOfYesterday },
  endOfDay: { type: "mod", fn: endOfDay },
  endOfHour: { type: "mod", fn: endOfHour },
  endOfISOWeek: { type: "mod", fn: endOfISOWeek },
  endOfISOWeekYear: { type: "mod", fn: endOfISOWeekYear },
  endOfMinute: { type: "mod", fn: endOfMinute },
  endOfMonth: { type: "mod", fn: endOfMonth },
  endOfQuarter: { type: "mod", fn: endOfQuarter },
  endOfSecond: { type: "mod", fn: endOfSecond },
  endOfYear: { type: "mod", fn: endOfYear },
  lastDayOfDecade: { type: "mod", fn: lastDayOfDecade },
  lastDayOfISOWeek: { type: "mod", fn: lastDayOfISOWeek },
  lastDayOfISOWeekYear: { type: "mod", fn: lastDayOfISOWeekYear },
  lastDayOfMonth: { type: "mod", fn: lastDayOfMonth },
  lastDayOfYear: { type: "mod", fn: lastDayOfYear },
  nextFriday: { type: "mod", fn: nextFriday },
  nextMonday: { type: "mod", fn: nextMonday },
  nextSaturday: { type: "mod", fn: nextSaturday },
  nextSunday: { type: "mod", fn: nextSunday },
  nextThursday: { type: "mod", fn: nextThursday },
  nextTuesday: { type: "mod", fn: nextTuesday },
  nextWednesday: { type: "mod", fn: nextWednesday },
  previousFriday: { type: "mod", fn: previousFriday },
  previousMonday: { type: "mod", fn: previousMonday },
  previousSaturday: { type: "mod", fn: previousSaturday },
  previousSunday: { type: "mod", fn: previousSunday },
  previousThursday: { type: "mod", fn: previousThursday },
  previousTuesday: { type: "mod", fn: previousTuesday },
  previousWednesday: { type: "mod", fn: previousWednesday },
  startOfDay: { type: "mod", fn: startOfDay },
  startOfDecade: { type: "mod", fn: startOfDecade },
  startOfHour: { type: "mod", fn: startOfHour },
  startOfISOWeek: { type: "mod", fn: startOfISOWeek },
  startOfISOWeekYear: { type: "mod", fn: startOfISOWeekYear },
  startOfMinute: { type: "mod", fn: startOfMinute },
  startOfMonth: { type: "mod", fn: startOfMonth },
  startOfQuarter: { type: "mod", fn: startOfQuarter },
  startOfSecond: { type: "mod", fn: startOfSecond },
  startOfYear: { type: "mod", fn: startOfYear },
}

/**
 * The modifiers for placeholder expressions.
 */
export enum DatePlaceholderModifierType {
  /** No modifier */
  NONE = "",
  /**
   * Use \`$\{<key>:date-expr:<expr>:<format>\}\` for date/time calculation expressions using a supported [date-fns helper function keyword](https://date-fns.org/docs/format) (e.g. `lastDayOfMonth`) and/or a [parse-duration format string](https://github.com/jkroso/parse-duration#parsestr-formatms) and then format the resulting date/time using a [date-fns format string](https://date-fns.org/docs/format).
   */
  DATE_EXPR = "date-expr",
  /**
   * Use \`$\{<key>:format:<format>\}\` to format the date/time using a [date-fns format strings](https://date-fns.org/docs/format).
   */
  FORMAT = "format",
  /**
   * Use \`$\{<key>:offset-format:<offset>:<format>\}\` to calculate the date/time offset using a [parse-duration format string](https://github.com/jkroso/parse-duration#parsestr-formatms) and then format the resulting date/time using a [date-fns format strings](https://date-fns.org/docs/format).
   * @deprecated Use `date-expr` instead.
   */
  OFFSET_FORMAT = "offset-format",
}

export class DateUtils {
  public static evaluate(
    modifier: DatePlaceholderModifierType,
    arg: string,
    value: Date,
  ) {
    let formatStr = defaultDateFormat
    let dateTime = value
    switch (modifier) {
      case DatePlaceholderModifierType.FORMAT:
        formatStr = arg
        break
      case DatePlaceholderModifierType.DATE_EXPR:
      case DatePlaceholderModifierType.OFFSET_FORMAT:
        {
          const args = arg.split(/:(.*)/s)
          const offset = args[0] ?? ""
          formatStr = args[1] ?? defaultDateFormat
          dateTime = DateUtils.parseExpression(value, offset)
        }
        break
    }
    const stringValue = format(dateTime, formatStr)
    return stringValue
  }

  public static parseExpression(value: Date, expr: string): Date {
    const baseExpr = Object.keys(DATE_EXPRESSIONS).reduce(
      (prev, k) => (expr.startsWith(k) ? k : prev),
      "",
    )
    if (baseExpr !== "") {
      const exprInfo = DATE_EXPRESSIONS[baseExpr]
      switch (exprInfo.type) {
        case "mod":
          value = (exprInfo.fn as ModDateType)(value)
          break
        case "new":
          value = (exprInfo.fn as NewDateType)()
          break
      }
      expr = expr.slice(baseExpr.length)
    }
    value = addMilliseconds(value, parse(expr) ?? 0)
    return value
  }
}
