import { RegexUtils } from "./RegexUtils"

describe("matchRegExp()", () => {
  it("should match regex without modifier", () => {
    const matches = RegexUtils.matchRegExp("^test$", "test")
    expect(matches?.[0]).toEqual("test")
  })
  it("should match regex with explicit modifier", () => {
    const matches = RegexUtils.matchRegExp("^test$", "TEST", "i")
    expect(matches?.[0]).toEqual("TEST")
  })
  it("should match regex with inline modifier", () => {
    const matches = RegexUtils.matchRegExp("(?i)^test$", "TEST")
    expect(matches?.[0]).toEqual("TEST")
  })
  it("should not match non-matching regex", () => {
    const matches = RegexUtils.matchRegExp("^test$", "something-else")
    expect(matches).toBeNull()
  })
})
