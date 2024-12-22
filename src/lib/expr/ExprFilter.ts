import {
  addMilliseconds,
  endOfDay,
  endOfDecade,
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
  lastDayOfQuarter,
  lastDayOfYear,
  nextFriday,
  nextMonday,
  nextSaturday,
  nextSunday,
  nextThursday,
  nextTuesday,
  nextWednesday,
  parse,
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
import parseDuration from "parse-duration"
import { DateType, ValueType } from "./ExprEvaluator"

export const defaultDateFormat = "yyyy-MM-dd HH:mm:ss"
export type ExpressionFilterFunction = (
  ...args: ValueType[]
) => ValueType | undefined
export type ExprInfoType = {
  lib?: string
  fn: ExpressionFilterFunction
  origFn?: string
  args?: (..._args: ValueType[]) => ValueType[]
  description?: string
}

const formatDate: ExpressionFilterFunction = (
  value: ValueType,
  ...args: ValueType[]
): string => {
  const fmt: string =
    (args[0] ?? "") != "" ? (args[0] as string) : defaultDateFormat
  return format(value as Date, fmt)
}

const join: ExpressionFilterFunction = (
  value: ValueType,
  ...args: ValueType[]
): ValueType => {
  const separator = args[0] ?? ","
  return (value as ValueType[])
    .map((e: ValueType) => String(e))
    .join(separator as string)
}

const offsetDate: ExpressionFilterFunction = (
  value: ValueType,
  ...args: ValueType[]
): ValueType => {
  // TODO: Assert DateType
  const fmt = args[0] as string
  if (fmt.trim() != "") {
    const durationValue = parseDuration(fmt)
    if (!durationValue) {
      throw new Error(`ERROR: Cannot parse date offset: ${fmt}`)
    }
    value = addMilliseconds(value as DateType, durationValue)
  }
  return value
}
const parseDate: ExpressionFilterFunction = (
  value: ValueType,
  ...args: ValueType[]
): ValueType => {
  // TODO: Assert string type
  return parse(value as string, args[0] as string, new Date())
}

export const filterFunctions: Record<string, ExprInfoType> = {
  // custom functions:
  formatDate: {
    lib: "date-fns",
    fn: formatDate,
    origFn: "format",
    args: (...args: ValueType[]) => [args[0], args[1]],
  },
  join: { fn: join },
  offsetDate: { fn: offsetDate },
  parseDate: {
    lib: "date-fns",
    fn: parseDate,
    origFn: "parse",
    args: (...args: ValueType[]) => [args[0], args[1], new Date()],
  },

  // date-fns functions:
  /*
  // Use this script to update all supported date-fns functions:
  (
    cat node_modules/date-fns/*.d.ts \
    | grep -E -A 2 '^export declare function [a-zA-Z0-9]+<DateType extends Date>' \
    | grep -E -B 2 '^\): DateType;' \
    | grep -E '^export declare function' \
    | sed -re 's/export declare function ([^<]+)<.+/\1/g' \
    | grep -E -v '^(toDate|constructNow)$' \
    | sort \
    | awk '{print "  "$1": { lib: \"date-fns\", fn: "$1" as ExpressionFilterFunction },"}'
    cat node_modules/date-fns/*.d.ts \
    | grep -E '^export declare function .+\(\): Date;$' \
    | sed -re 's/export declare function ([^<]+)\(\).+/\1/g' \
    | sort \
    | awk '{print "  "$1": { lib: \"date-fns\", fn: "$1" as ExpressionFilterFunction, args: (..._args: ValueType[]) => [] },"}'
  ) | sort
  */
  endOfDay: { lib: "date-fns", fn: endOfDay as ExpressionFilterFunction },
  endOfDecade: { lib: "date-fns", fn: endOfDecade as ExpressionFilterFunction },
  endOfHour: { lib: "date-fns", fn: endOfHour as ExpressionFilterFunction },
  endOfISOWeek: {
    lib: "date-fns",
    fn: endOfISOWeek as ExpressionFilterFunction,
  },
  endOfISOWeekYear: {
    lib: "date-fns",
    fn: endOfISOWeekYear as ExpressionFilterFunction,
  },
  endOfMinute: { lib: "date-fns", fn: endOfMinute as ExpressionFilterFunction },
  endOfMonth: { lib: "date-fns", fn: endOfMonth as ExpressionFilterFunction },
  endOfQuarter: {
    lib: "date-fns",
    fn: endOfQuarter as ExpressionFilterFunction,
  },
  endOfSecond: { lib: "date-fns", fn: endOfSecond as ExpressionFilterFunction },
  endOfToday: {
    lib: "date-fns",
    fn: endOfToday as ExpressionFilterFunction,
    args: (..._args: ValueType[]) => [],
  },
  endOfTomorrow: {
    lib: "date-fns",
    fn: endOfTomorrow as ExpressionFilterFunction,
    args: (..._args: ValueType[]) => [],
  },
  endOfYear: { lib: "date-fns", fn: endOfYear as ExpressionFilterFunction },
  endOfYesterday: {
    lib: "date-fns",
    fn: endOfYesterday as ExpressionFilterFunction,
    args: (..._args: ValueType[]) => [],
  },
  lastDayOfDecade: {
    lib: "date-fns",
    fn: lastDayOfDecade as ExpressionFilterFunction,
  },
  lastDayOfISOWeek: {
    lib: "date-fns",
    fn: lastDayOfISOWeek as ExpressionFilterFunction,
  },
  lastDayOfISOWeekYear: {
    lib: "date-fns",
    fn: lastDayOfISOWeekYear as ExpressionFilterFunction,
  },
  lastDayOfMonth: {
    lib: "date-fns",
    fn: lastDayOfMonth as ExpressionFilterFunction,
  },
  lastDayOfQuarter: {
    lib: "date-fns",
    fn: lastDayOfQuarter as ExpressionFilterFunction,
  },
  lastDayOfYear: {
    lib: "date-fns",
    fn: lastDayOfYear as ExpressionFilterFunction,
  },
  nextFriday: { lib: "date-fns", fn: nextFriday as ExpressionFilterFunction },
  nextMonday: { lib: "date-fns", fn: nextMonday as ExpressionFilterFunction },
  nextSaturday: {
    lib: "date-fns",
    fn: nextSaturday as ExpressionFilterFunction,
  },
  nextSunday: { lib: "date-fns", fn: nextSunday as ExpressionFilterFunction },
  nextThursday: {
    lib: "date-fns",
    fn: nextThursday as ExpressionFilterFunction,
  },
  nextTuesday: { lib: "date-fns", fn: nextTuesday as ExpressionFilterFunction },
  nextWednesday: {
    lib: "date-fns",
    fn: nextWednesday as ExpressionFilterFunction,
  },
  previousFriday: {
    lib: "date-fns",
    fn: previousFriday as ExpressionFilterFunction,
  },
  previousMonday: {
    lib: "date-fns",
    fn: previousMonday as ExpressionFilterFunction,
  },
  previousSaturday: {
    lib: "date-fns",
    fn: previousSaturday as ExpressionFilterFunction,
  },
  previousSunday: {
    lib: "date-fns",
    fn: previousSunday as ExpressionFilterFunction,
  },
  previousThursday: {
    lib: "date-fns",
    fn: previousThursday as ExpressionFilterFunction,
  },
  previousTuesday: {
    lib: "date-fns",
    fn: previousTuesday as ExpressionFilterFunction,
  },
  previousWednesday: {
    lib: "date-fns",
    fn: previousWednesday as ExpressionFilterFunction,
  },
  startOfDay: { lib: "date-fns", fn: startOfDay as ExpressionFilterFunction },
  startOfDecade: {
    lib: "date-fns",
    fn: startOfDecade as ExpressionFilterFunction,
  },
  startOfHour: { lib: "date-fns", fn: startOfHour as ExpressionFilterFunction },
  startOfISOWeek: {
    lib: "date-fns",
    fn: startOfISOWeek as ExpressionFilterFunction,
  },
  startOfISOWeekYear: {
    lib: "date-fns",
    fn: startOfISOWeekYear as ExpressionFilterFunction,
  },
  startOfMinute: {
    lib: "date-fns",
    fn: startOfMinute as ExpressionFilterFunction,
  },
  startOfMonth: {
    lib: "date-fns",
    fn: startOfMonth as ExpressionFilterFunction,
  },
  startOfQuarter: {
    lib: "date-fns",
    fn: startOfQuarter as ExpressionFilterFunction,
  },
  startOfSecond: {
    lib: "date-fns",
    fn: startOfSecond as ExpressionFilterFunction,
  },
  startOfToday: {
    lib: "date-fns",
    fn: startOfToday as ExpressionFilterFunction,
    args: (..._args: ValueType[]) => [],
  },
  startOfTomorrow: {
    lib: "date-fns",
    fn: startOfTomorrow as ExpressionFilterFunction,
    args: (..._args: ValueType[]) => [],
  },
  startOfYear: { lib: "date-fns", fn: startOfYear as ExpressionFilterFunction },
  startOfYesterday: {
    lib: "date-fns",
    fn: startOfYesterday as ExpressionFilterFunction,
    args: (..._args: ValueType[]) => [],
  },
}

export function executeFilter(
  name: string,
  value: ValueType,
  ...args: ValueType[]
): ValueType {
  if (!Object.keys(filterFunctions).includes(name)) {
    throw new Error(`Unknown expression function '${name}'`)
  }
  const fnInfo = filterFunctions[name]
  if (fnInfo.args) {
    value = fnInfo.fn(...(fnInfo.args(value, ...args) as ValueType[]))
  } else {
    value = fnInfo.fn(value, ...args)
  }
  return value
}
