import { ProcessingStage, ThreadActionConfigSchema } from "./ActionConfig"

describe("ActionConfig", () => {
  it("should have defaults (ThreadActionConfig)", () => {
    const config = ThreadActionConfigSchema.parse({ name: "thread.addLabel" })
    expect(config.description).toBe("")
    expect(config.processingStage).toBe(ProcessingStage.POST_MAIN)
    expect(config.name).toBe("thread.addLabel")
    expect(config.args).toEqual({})
  })

  it("should parse partial config", () => {
    const config = ThreadActionConfigSchema.parse({
      name: "thread.addLabel",
      args: { label: "test" },
      processingStage: ProcessingStage.PRE_MAIN,
    })
    expect(config.name).toBe("thread.addLabel")
    expect(config.args).toEqual({ label: "test" })
    expect(config.processingStage).toBe(ProcessingStage.PRE_MAIN)
  })

  it("should strip extraneous properties", () => {
    const config = ThreadActionConfigSchema.parse({
      name: "thread.noop",
      extra: "should be stripped",
    } as any)
    expect(config.name).toBe("thread.noop")
    expect((config as any).extra).toBeUndefined()
  })

  it("should validate required name", () => {
    expect(() => ThreadActionConfigSchema.parse({} as any)).toThrow()
  })
})
