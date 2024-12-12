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
  it("should match multi-line regex", () => {
    const matches = RegexUtils.matchRegExp(
      "^US date: (?<usDate>[0-9/]+)\nGerman date: (?<germanDate>[0-9.]+)\nShort German date: (?<shortGermanDate>[0-9.]+)\nISO date: (?<isoDate>[0-9-]+)$",
      "US date: 7/14/2024\nGerman date: 14.7.2024\nShort German date: 14.7.24\nISO date: 2024-07-14",
      "g",
    )
    expect(matches?.groups?.usDate).toEqual("7/14/2024")
    expect(matches?.groups?.germanDate).toEqual("14.7.2024")
    expect(matches?.groups?.shortGermanDate).toEqual("14.7.24")
    expect(matches?.groups?.isoDate).toEqual("2024-07-14")
  })
})
