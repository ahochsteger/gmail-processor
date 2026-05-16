import { ConfigMocks } from "../../../test/mocks/ConfigMocks"
import { newV1Config } from "./V1Config"
import { validateV1Config } from "./V1Validate"

describe("validate()", () => {
  it("should validate a minimum compliant v1 config without errors", () => {
    const result = validateV1Config({
      processedLabel: "gmail2gdrive/client-test",
      sleepTime: 100,
      maxRuntime: 280,
      newerThan: "2m",
      timezone: "GMT",
      rules: [
        {
          filter: "to:my.name+scans@gmail.com",
          folder: "'Scans'-yyyy-MM-dd",
        },
      ],
    })
    expect(result.success).toBe(true)
  })
  it("should validate compliant v1 config without errors", () => {
    const result = validateV1Config({
      processedLabel: "gmail2gdrive/client-test",
      sleepTime: 100,
      maxRuntime: 280,
      newerThan: "2m",
      timezone: "GMT",
      rules: [
        {
          filter: "to:my.name+scans@gmail.com",
          folder: "'Scans'-yyyy-MM-dd",
        },
        {
          filter: "from:example2@example.com",
          folder: "'Examples/example2'",
          filenameFromRegexp: "(.*\\.pdf)$",
        },
        {
          filter: "(from:example3a@example.com OR from:example3b@example.com)",
          folder: "'Examples/example3ab'",
          filenameTo: "'file-'yyyy-MM-dd-'%s.txt'",
          archive: true,
        },
      ],
    })
    expect(result.success).toBe(true)
  })
  it("should report missing rules", () => {
    const result = validateV1Config({})
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.errors?.length).toEqual(6)
    }
  })
  it("should validate all MockFactory v1 config JSON without errors", () => {
    const result = validateV1Config(ConfigMocks.newDefaultV1ConfigJson())
    expect(result.success).toBe(true)
  })
})

describe("newV1Config()", () => {
  it("should throw when no rules are provided", () => {
    expect(() => newV1Config({ rules: [] })).toThrow(
      "No rules found - make sure there is at least one rule present!",
    )
  })

  it("should return a config with default values when a rule is provided", () => {
    const cfg = newV1Config({
      rules: [{ filter: "from:test@example.com", folder: "TestFolder" }],
    })
    expect(cfg.globalFilter).toBeDefined()
    expect(cfg.processedLabel).toBe("to-gdrive/processed")
    expect(cfg.sleepTime).toBe(100)
    expect(cfg.maxRuntime).toBe(280)
    expect(cfg.newerThan).toBe("2m")
    expect(cfg.timezone).toBe("Etc/UTC")
    expect(cfg.rules).toHaveLength(1)
  })
})
