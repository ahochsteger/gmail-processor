import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import { validateConfig } from "./Validate"

// TODO: Add partial schema validation
// See:
// - https://github.com/ajv-validator/ajv/issues/211
// - https://stackoverflow.com/questions/59951929/how-can-i-compile-a-subset-of-a-json-schema-with-ajv

describe("validate()", () => {
  it("should validate a minimum compliant v2 config without errors", () => {
    validateConfig({})
    expect(validateConfig.errors).toBeNull()
  })
  it("should validate all MockFactory config JSON without errors", () => {
    validateConfig({
      global: {
        thread: { actions: [ConfigMocks.newDefaultThreadActionConfigJson()] },
      },
    })
    expect(validateConfig.errors).toBeNull()
    validateConfig({
      attachments: [ConfigMocks.newDefaultAttachmentConfigJson()],
    })
    expect(validateConfig.errors).toBeNull()
    validateConfig(ConfigMocks.newDefaultConfigJson())
    expect(validateConfig.errors).toBeNull()
    validateConfig({ messages: [ConfigMocks.newDefaultMessageConfigJson()] })
    expect(validateConfig.errors).toBeNull()
    validateConfig({ settings: ConfigMocks.newDefaultSettingsConfigJson() })
    expect(validateConfig.errors).toBeNull()
    validateConfig({ threads: [ConfigMocks.newDefaultThreadConfigJson()] })
    expect(validateConfig.errors).toBeNull()
  })
  it("should report additional properties", () => {
    const config = {
      rules: [],
      additional: "some-value",
    }
    const expected = [
      {
        instancePath: "",
        keyword: "additionalProperties",
        params: { additionalProperty: "rules" },
      },
      {
        instancePath: "",
        keyword: "additionalProperties",
        params: { additionalProperty: "additional" },
      },
    ]
    validateConfig(config)
    expect(validateConfig.errors).toMatchObject(expected)
  })
})
