import { DatePlaceholderModifierType, DateUtils } from "./DateUtils"

const dateFormat = "yyyy-MM-dd"
const timeFormat = "HH:mm:ss.SSS"
const dateTimeFormat = `${dateFormat} ${timeFormat}`
const dateStr = "2024-02-13" // NOTE: Should not be start or end of week
const timeStr = "12:34:56.789"
const endTimeStr = "23:59:59.999"
const startTimeStr = "00:00:00.000"
const dateTimeStr = `${dateStr} ${timeStr}`
const isoDateTimeStr = `${dateStr}T${timeStr}`
const date = new Date(isoDateTimeStr)

jest.useFakeTimers({ now: date })

describe("Date Placeholder", () => {
  it("should format a date", () => {
    expect(
      DateUtils.evaluate(
        DatePlaceholderModifierType.FORMAT,
        dateTimeFormat,
        date,
      ),
    ).toEqual(dateTimeStr)
  })
  it("should handle modifier 'offset-format' with relative offset expression", () => {
    const offset = "-2d"
    expect(
      DateUtils.evaluate(
        DatePlaceholderModifierType.DATE_EXPR,
        `${offset}:${dateTimeFormat}`,
        date,
      ),
    ).toEqual(`2024-02-11 ${timeStr}`)
  })
  it("should handle modifier 'offset-format' with lastDayOfMonth expression", () => {
    const offset = "lastDayOfMonth"
    expect(
      DateUtils.evaluate(
        DatePlaceholderModifierType.DATE_EXPR,
        `${offset}:${dateTimeFormat}`,
        date,
      ),
    ).toEqual(`2024-02-29 ${startTimeStr}`)
  })
  it("should handle modifier 'offset-format' with lastDayOfMonth and relative date expression", () => {
    const offset = "lastDayOfMonth-2d"
    expect(
      DateUtils.evaluate(
        DatePlaceholderModifierType.DATE_EXPR,
        `${offset}:${dateTimeFormat}`,
        date,
      ),
    ).toEqual(`2024-02-27 ${startTimeStr}`)
  })
  it("should handle date-fns expressions", () => {
    const expected = {
      endOfToday: `2024-02-13 ${endTimeStr}`,
      endOfTomorrow: `2024-02-14 ${endTimeStr}`,
      endOfYesterday: `2024-02-12 ${endTimeStr}`,
      startOfToday: `2024-02-13 ${startTimeStr}`,
      startOfTomorrow: `2024-02-14 ${startTimeStr}`,
      startOfYesterday: `2024-02-12 ${startTimeStr}`,
      endOfDay: `${dateStr} ${endTimeStr}`,
      endOfHour: `${dateStr} 12:59:59.999`,
      endOfISOWeek: `2024-02-18 ${endTimeStr}`,
      endOfISOWeekYear: `2024-12-29 ${endTimeStr}`,
      endOfMinute: `${dateStr} 12:34:59.999`,
      endOfMonth: `2024-02-29 ${endTimeStr}`,
      endOfQuarter: `2024-03-31 ${endTimeStr}`,
      endOfSecond: `${dateStr} 12:34:56.999`,
      endOfYear: `2024-12-31 ${endTimeStr}`,
      lastDayOfDecade: `2029-12-31 ${startTimeStr}`,
      lastDayOfISOWeek: `2024-02-18 ${startTimeStr}`,
      lastDayOfISOWeekYear: `2024-12-29 ${startTimeStr}`,
      lastDayOfMonth: `2024-02-29 ${startTimeStr}`,
      lastDayOfYear: `2024-12-31 ${startTimeStr}`,
      nextFriday: `2024-02-16 ${timeStr}`,
      nextMonday: `2024-02-19 ${timeStr}`,
      nextSaturday: `2024-02-17 ${timeStr}`,
      nextSunday: `2024-02-18 ${timeStr}`,
      nextThursday: `2024-02-15 ${timeStr}`,
      nextTuesday: `2024-02-20 ${timeStr}`,
      nextWednesday: `2024-02-14 ${timeStr}`,
      previousFriday: `2024-02-09 ${timeStr}`,
      previousMonday: `2024-02-12 ${timeStr}`,
      previousSaturday: `2024-02-10 ${timeStr}`,
      previousSunday: `2024-02-11 ${timeStr}`,
      previousThursday: `2024-02-08 ${timeStr}`,
      previousTuesday: `2024-02-06 ${timeStr}`,
      previousWednesday: `2024-02-07 ${timeStr}`,
      startOfDay: `${dateStr} ${startTimeStr}`,
      startOfDecade: `2020-01-01 ${startTimeStr}`,
      startOfHour: `${dateStr} 12:00:00.000`,
      startOfISOWeek: `2024-02-12 ${startTimeStr}`,
      startOfISOWeekYear: `2024-01-01 ${startTimeStr}`,
      startOfMinute: `${dateStr} 12:34:00.000`,
      startOfMonth: `2024-02-01 ${startTimeStr}`,
      startOfQuarter: `2024-01-01 ${startTimeStr}`,
      startOfSecond: `${dateStr} 12:34:56.000`,
      startOfYear: `2024-01-01 ${startTimeStr}`,
    }
    const actual: Partial<typeof expected> = {}
    Object.keys(expected).forEach((k) => {
      actual[k as keyof typeof expected] = DateUtils.evaluate(
        DatePlaceholderModifierType.DATE_EXPR,
        `${k}:${dateTimeFormat}`,
        date,
      )
    })
    expect(actual).toEqual(expected)
  })
})
