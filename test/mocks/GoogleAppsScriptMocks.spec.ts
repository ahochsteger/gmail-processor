import { mock } from "jest-mock-extended"

// let Logger: Console = console
// let Utilities: GoogleAppsScript.Utilities.Utilities
const Logger = mock<GoogleAppsScript.Base.Logger>()
const Utilities = mock<GoogleAppsScript.Utilities.Utilities>()

describe("Google Apps Script Mocks", () => {
  describe("Logger", () => {
    it("should log a message", () => {
      Logger.log("Logging works ...")
    })
  })
  describe("Utilities", () => {
    it("should provide formatDate", () => {
      Utilities.formatDate.mockReturnValue("2019-05-05 12:34:56")
      const s = Utilities.formatDate(
        new Date("2019-05-05T12:34:56Z"),
        "UTC",
        "yyyy-MM-dd HH:MM:SS",
      )
      expect(s).toBe("2019-05-05 12:34:56")
    })
  })
})
