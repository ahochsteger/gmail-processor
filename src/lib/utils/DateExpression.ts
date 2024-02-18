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
import { PlaceholderModifierType } from "./PatternUtil"

export const defaultDateFormat = "yyyy-MM-dd HH:mm:ss"
type ModDateType = (d: Date) => Date
type NewDateType = () => Date
export type ExprInfoType = {
  type: "mod" | "new"
  fn: ModDateType | NewDateType
}
export const DATE_FNS_FUNCTIONS: Record<string, ExprInfoType> = {
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

export class DateExpression {
  public static evaluate(
    origModifier: PlaceholderModifierType,
    origArg: string,
    value: Date,
  ) {
    let formatStr = defaultDateFormat
    let dateTime = value
    const { modifier, arg } = this.normalizeExpression(origModifier, origArg)
    if (
      modifier !== PlaceholderModifierType.NONE &&
      modifier !== PlaceholderModifierType.DATE
    ) {
      return null
    }
    const args = arg.split(/:(.*)/s)
    const expression = args[0] ?? ""
    formatStr = args[1] ?? defaultDateFormat
    dateTime = DateExpression.parseExpression(value, expression)
    const stringValue = format(dateTime, formatStr)
    return stringValue
  }

  public static normalizeExpression(
    modifier: PlaceholderModifierType,
    arg: string,
  ): {
    modifier: PlaceholderModifierType
    arg: string
  } {
    switch (modifier) {
      case PlaceholderModifierType.FORMAT:
        modifier = PlaceholderModifierType.DATE
        arg = `:${arg}`
        break
      case PlaceholderModifierType.OFFSET_FORMAT:
        modifier = PlaceholderModifierType.DATE
        break
    }
    return {
      modifier,
      arg,
    }
  }

  public static parseExpression(value: Date, expr: string): Date {
    const baseExpr = Object.keys(DATE_FNS_FUNCTIONS).reduce(
      (prev, k) => (expr.startsWith(k) ? k : prev),
      "",
    )
    if (baseExpr !== "") {
      const exprInfo = DATE_FNS_FUNCTIONS[baseExpr]
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
