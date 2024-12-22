import { fakedSystemDateTime } from "../../test/mocks/MockFactory"
import { executeFilter } from "./ExprFilter"

jest.useFakeTimers({ now: fakedSystemDateTime })

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

  describe("date-fns filter", () => {
    it("should handle startOfISOWeek", () => {
      const actual = executeFilter("startOfISOWeek", new Date("2024-12-01"))
      expect(actual).toEqual(new Date("2024-11-25"))
    })
    it("should handle startOfTomorrow", () => {
      const actual = executeFilter("startOfTomorrow", "")
      expect(actual).toEqual(new Date("2023-06-27"))
    })
  })
})
