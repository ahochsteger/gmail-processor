import {
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

export const defaultDateFormat = "yyyy-MM-dd HH:mm:ss"
type ModDateType = (d: Date | number | string) => Date
type NewDateType = () => Date
export type ExprInfoType = {
  type: "mod" | "new"
  fn: ModDateType | NewDateType
}

/*
// Use this script to extract all supported date functions:
(
  cat node_modules/date-fns/*.d.ts \
  | grep -E -A 2 '^export declare function [a-zA-Z0-9]+<DateType extends Date>' \
  | grep -E -B 2 '^\): DateType;' \
  | grep -E '^export declare function' \
  | sed -re 's/export declare function ([^<]+)<.+/\1/g' \
  | grep -E -v '^(toDate|constructNow)$' \
  | sort \
  | awk '{print "  "$1": { type: \"mod\", fn: "$1" },"}'
  cat node_modules/date-fns/*.d.ts \
  | grep -E '^export declare function .+\(\): Date;$' \
  | sed -re 's/export declare function ([^<]+)\(\).+/\1/g' \
  | sort \
  | awk '{print "  "$1": { type: \"new\", fn: "$1" },"}'
) | sort
*/
export const DATE_FNS_FUNCTIONS: Record<string, ExprInfoType> = {
  endOfDay: { type: "mod", fn: endOfDay },
  endOfDecade: { type: "mod", fn: endOfDecade },
  endOfHour: { type: "mod", fn: endOfHour },
  endOfISOWeek: { type: "mod", fn: endOfISOWeek },
  endOfISOWeekYear: { type: "mod", fn: endOfISOWeekYear },
  endOfMinute: { type: "mod", fn: endOfMinute },
  endOfMonth: { type: "mod", fn: endOfMonth },
  endOfQuarter: { type: "mod", fn: endOfQuarter },
  endOfSecond: { type: "mod", fn: endOfSecond },
  endOfToday: { type: "new", fn: endOfToday },
  endOfTomorrow: { type: "new", fn: endOfTomorrow },
  endOfYear: { type: "mod", fn: endOfYear },
  endOfYesterday: { type: "new", fn: endOfYesterday },
  lastDayOfDecade: { type: "mod", fn: lastDayOfDecade },
  lastDayOfISOWeek: { type: "mod", fn: lastDayOfISOWeek },
  lastDayOfISOWeekYear: { type: "mod", fn: lastDayOfISOWeekYear },
  lastDayOfMonth: { type: "mod", fn: lastDayOfMonth },
  lastDayOfQuarter: { type: "mod", fn: lastDayOfQuarter },
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
  startOfToday: { type: "new", fn: startOfToday },
  startOfTomorrow: { type: "new", fn: startOfTomorrow },
  startOfYear: { type: "mod", fn: startOfYear },
  startOfYesterday: { type: "new", fn: startOfYesterday },
}

export function getDateFnInfo(name: string): ExprInfoType | undefined {
  return DATE_FNS_FUNCTIONS[name]
}
