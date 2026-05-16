import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import { validateConfig } from "./Validate"

// TODO: Add partial schema validation
// See:
// - https://github.com/ajv-validator/ajv/issues/211
// - https://stackoverflow.com/questions/59951929/how-can-i-compile-a-subset-of-a-json-schema-with-ajv

describe("validate()", () => {
  it("should validate a minimum compliant v2 config without errors", () => {
    const result = validateConfig({})
    expect(result.success).toBe(true)
  })
  it("should validate all MockFactory config JSON without errors", () => {
    let result = validateConfig({
      global: {
        thread: { actions: [ConfigMocks.newDefaultThreadActionConfigJson()] },
      },
    })
    expect(result.success).toBe(true)
    result = validateConfig({
      attachments: [ConfigMocks.newDefaultAttachmentConfigJson()],
    })
    expect(result.success).toBe(true)
    result = validateConfig(ConfigMocks.newDefaultConfigJson())
    expect(result.success).toBe(true)
    result = validateConfig({
      messages: [ConfigMocks.newDefaultMessageConfigJson()],
    })
    expect(result.success).toBe(true)
    result = validateConfig({
      settings: ConfigMocks.newDefaultSettingsConfigJson(),
    })
    expect(result.success).toBe(true)
    result = validateConfig({
      threads: [ConfigMocks.newDefaultThreadConfigJson()],
    })
    expect(result.success).toBe(true)
  })
  it("should report additional properties", () => {
    const config = {
      rules: [],
      additional: "some-value",
    }
    const expected = [
      {
        message: 'Unrecognized keys: "rules", "additional"',
        path: "",
      },
    ]
    const result = validateConfig(config)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.errors).toMatchObject(expected)
    }
  })
})
