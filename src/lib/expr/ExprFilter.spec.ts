import { format } from "date-fns"
import { fakedSystemDateTime } from "../../test/mocks/MockFactory"
import { executeFilter } from "./ExprFilter"

jest.useFakeTimers({ now: fakedSystemDateTime })

const dateFormat = "yyyy-MM-dd"
const timeFormat = "HH:mm:ss.SSS"
const dateTimeFormat = `${dateFormat} ${timeFormat}`
const dateStr = "2024-02-13" // NOTE: Should not be start or end of week
const timeStr = "12:34:56.789"
const dateTimeStr = `${dateStr} ${timeStr}`
const isoDateTimeStr = `${dateStr}T${timeStr}`
const date = new Date(isoDateTimeStr)

jest.useFakeTimers({ now: date })

describe("executeFilter()", () => {
  it("should handle invalid filter functions", () => {
    expect(() => executeFilter("invalid", "value")).toThrow()
  })

  describe("custom filter", () => {
    it("should handle formatDate", () => {
      const actual = executeFilter(
        "formatDate",
        new Date("2024-12-01"),
        "dd.MM.yyyy",
      )
      expect(actual).toEqual("01.12.2024")
    })
    it("should handle join", () => {
      const actual = executeFilter("join", ["value1", "value2"])
      expect(actual).toEqual("value1,value2")
    })
    it("should handle offsetDate", () => {
      const actual = executeFilter("offsetDate", new Date("2024-12-01"), "-2d")
      expect(actual).toEqual(new Date("2024-11-29"))
    })
    it("should handle parseDate", () => {
      const actual = executeFilter("parseDate", "01.12.2024", "dd.MM.yyyy")
      expect(actual).toEqual(new Date("2024-12-01"))
    })
  })

  describe("date-fns functions", () => {
    it("should format a date", () => {
      expect(executeFilter("formatDate", date, dateTimeFormat)).toEqual(
        dateTimeStr,
      )
    })
    it("should handle modifier 'offset-format' with relative offset expression", () => {
      expect(executeFilter("offsetDate", date, "-2d")).toEqual(
        new Date(`2024-02-11 ${timeStr}`),
      )
    })
    it("should handle modifier 'offset-format' with lastDayOfMonth expression", () => {
      expect(executeFilter("lastDayOfMonth", date)).toEqual(
        new Date(`2024-02-29 00:00:00.000`),
      )
    })
    it("should handle date-fns expressions", () => {
      const expected = {
        endOfDay: `${dateStr} 23:59:59.999`,
        endOfDecade: "2029-12-31 23:59:59.999",
        endOfHour: `${dateStr} 12:59:59.999`,
        endOfISOWeek: `2024-02-18 23:59:59.999`,
        endOfISOWeekYear: `2024-12-29 23:59:59.999`,
        endOfMinute: `${dateStr} 12:34:59.999`,
        endOfMonth: `2024-02-29 23:59:59.999`,
        endOfQuarter: `2024-03-31 23:59:59.999`,
        endOfSecond: `${dateStr} 12:34:56.999`,
        endOfToday: `2024-02-13 23:59:59.999`,
        endOfTomorrow: `2024-02-14 23:59:59.999`,
        endOfWeek: `2024-02-17 23:59:59.999`,
        endOfYear: `2024-12-31 23:59:59.999`,
        endOfYesterday: `2024-02-12 23:59:59.999`,
        lastDayOfDecade: `2029-12-31 00:00:00.000`,
        lastDayOfISOWeek: `2024-02-18 00:00:00.000`,
        lastDayOfISOWeekYear: `2024-12-29 00:00:00.000`,
        lastDayOfMonth: `2024-02-29 00:00:00.000`,
        lastDayOfQuarter: "2024-03-31 00:00:00.000",
        lastDayOfWeek: `2024-02-17 00:00:00.000`,
        lastDayOfYear: `2024-12-31 00:00:00.000`,
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
        roundToNearestHours: `${dateStr} 13:00:00.000`,
        roundToNearestMinutes: `${dateStr} 12:35:00.000`,
        startOfDay: `${dateStr} 00:00:00.000`,
        startOfDecade: `2020-01-01 00:00:00.000`,
        startOfHour: `${dateStr} 12:00:00.000`,
        startOfISOWeek: `2024-02-12 00:00:00.000`,
        startOfISOWeekYear: `2024-01-01 00:00:00.000`,
        startOfMinute: `${dateStr} 12:34:00.000`,
        startOfMonth: `2024-02-01 00:00:00.000`,
        startOfQuarter: `2024-01-01 00:00:00.000`,
        startOfSecond: `${dateStr} 12:34:56.000`,
        startOfToday: `2024-02-13 00:00:00.000`,
        startOfTomorrow: `2024-02-14 00:00:00.000`,
        startOfWeek: `2024-02-11 00:00:00.000`,
        startOfWeekYear: `2023-12-31 00:00:00.000`,
        startOfYear: `2024-01-01 00:00:00.000`,
        startOfYesterday: `2024-02-12 00:00:00.000`,
      }
      const actual: Partial<typeof expected> = {}
      Object.keys(expected).forEach((k) => {
        actual[k as keyof typeof expected] = format(
          executeFilter(k, date) as Date,
          dateTimeFormat,
        )
      })
      expect(actual).toEqual(expected)
    })
  })
})
