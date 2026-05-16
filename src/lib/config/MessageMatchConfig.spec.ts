import { MessageFlag } from "./MessageFlag"
import { newMessageMatchConfig } from "./MessageMatchConfig"

describe("MessageMatchConfig", () => {
  it("should have defaults", () => {
    const config = newMessageMatchConfig()
    expect(config.body).toBe(".*")
    expect(config.from).toBe(".*")
    expect(config.is).toEqual([])
    expect(config.newerThan).toBe("")
    expect(config.olderThan).toBe("")
    expect(config.plainBody).toBe(".*")
    expect(config.rawHeaders).toBe(".*")
    expect(config.subject).toBe(".*")
    expect(config.to).toBe(".*")
  })

  it("should parse partial config", () => {
    const config = newMessageMatchConfig({
      subject: "Test Subject",
      is: [MessageFlag.UNREAD],
    })
    expect(config.subject).toBe("Test Subject")
    expect(config.is).toEqual([MessageFlag.UNREAD])
    expect(config.from).toBe(".*")
  })

  it("should strip extraneous properties", () => {
    const config = newMessageMatchConfig({
      subject: "Test",
      extra: "should be stripped",
    } as any)
    expect(config.subject).toBe("Test")
    expect((config as any).extra).toBeUndefined()
  })

  it("should validate types", () => {
    expect(() =>
      newMessageMatchConfig({
        is: "not an array" as any,
      }),
    ).toThrow()
  })
})
