import { newThreadMatchConfig } from "./ThreadMatchConfig"

describe("ThreadMatchConfig", () => {
  it("should have defaults", () => {
    const config = newThreadMatchConfig()
    expect(config.firstMessageSubject).toBe(".*")
    expect(config.labels).toBe(".*")
    expect(config.maxMessageCount).toBe(-1)
    expect(config.minMessageCount).toBe(1)
    expect(config.query).toBe(
      "has:attachment -in:trash -in:drafts -in:spam newer_than:1d",
    )
  })

  it("should parse partial config", () => {
    const config = newThreadMatchConfig({
      query: "label:test",
    })
    expect(config.query).toBe("label:test")
    expect(config.firstMessageSubject).toBe(".*")
  })

  it("should strip extraneous properties", () => {
    const config = newThreadMatchConfig({
      query: "test",
      extra: "should be stripped",
    } as any)
    expect(config.query).toBe("test")
    expect((config as any).extra).toBeUndefined()
  })

  it("should validate types", () => {
    expect(() =>
      newThreadMatchConfig({
        maxMessageCount: "not a number" as any,
      }),
    ).toThrow()
  })
})
