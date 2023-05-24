/* eslint-disable @typescript-eslint/no-explicit-any */
import { MockFactory } from "../../test/mocks/MockFactory"
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
      global: { actions: [MockFactory.newDefaultThreadActionConfigJson()] },
    })
    expect(validateConfig.errors).toBeNull()
    validateConfig({
      attachments: [MockFactory.newDefaultAttachmentConfigJson()],
    })
    expect(validateConfig.errors).toBeNull()
    validateConfig(MockFactory.newDefaultConfigJson())
    expect(validateConfig.errors).toBeNull()
    validateConfig({ messages: [MockFactory.newDefaultMessageConfigJson()] })
    expect(validateConfig.errors).toBeNull()
    validateConfig({ settings: MockFactory.newDefaultSettingsConfigJson() })
    expect(validateConfig.errors).toBeNull()
    validateConfig({ threads: [MockFactory.newDefaultThreadConfigJson()] })
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
