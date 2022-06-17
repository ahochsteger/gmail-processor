import dateFormat from "dateformat"

describe("dateformat", () => {
  it("should format a date", () => {
    const date = new Date(2022, 5, 16, 14, 15, 16)
    expect(dateFormat(date, "yyyy-mm-dd HH:MM:ss")).toBe("2022-06-16 14:15:16")
  })
})
