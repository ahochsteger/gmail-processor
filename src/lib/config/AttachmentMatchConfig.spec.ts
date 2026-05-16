import { newAttachmentMatchConfig } from "./AttachmentMatchConfig"

describe("AttachmentMatchConfig", () => {
  it("should have defaults", () => {
    const config = newAttachmentMatchConfig()
    expect(config.contentType).toBe(".*")
    expect(config.includeAttachments).toBe(true)
    expect(config.includeInlineImages).toBe(true)
    expect(config.largerThan).toBe(-1)
    expect(config.name).toBe("(.*)")
    expect(config.smallerThan).toBe(-1)
  })

  it("should parse partial config", () => {
    const config = newAttachmentMatchConfig({
      contentType: "application/pdf",
      largerThan: 1024,
    })
    expect(config.contentType).toBe("application/pdf")
    expect(config.includeAttachments).toBe(true)
    expect(config.largerThan).toBe(1024)
  })

  it("should strip extraneous properties", () => {
    const config = newAttachmentMatchConfig({
      contentType: "image/png",
      extra: "should be stripped",
    } as any)
    expect(config.contentType).toBe("image/png")
    expect((config as any).extra).toBeUndefined()
  })

  it("should validate types", () => {
    expect(() =>
      newAttachmentMatchConfig({
        largerThan: "not a number" as any,
      }),
    ).toThrow()
  })
})
