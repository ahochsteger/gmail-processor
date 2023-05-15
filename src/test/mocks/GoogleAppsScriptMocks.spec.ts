import { mock } from "jest-mock-extended"

const Utilities = mock<GoogleAppsScript.Utilities.Utilities>()

describe("Google Apps Script Mocks", () => {
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
