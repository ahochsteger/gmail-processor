/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateConfig } from "./Validate"

describe("validate()", () => {
  it("should validate a minimum compliant v2 config without errors", () => {
    validateConfig({
      global: {
        match: {},
      },
      settings: {},
    })
    expect(validateConfig.errors).toBeFalsy()
  })
  it("should add missing properties with default values", () => {
    const config = {
      global: { match: {} },
      settings: {
        additional: "some-value",
      },
    }
    validateConfig(config)
    expect((config.settings as any).timezone).toEqual("UTC")
    expect(config.settings.additional).toBeUndefined()
  })
  it("should remove additional properties", () => {
    const config = {
      global: { match: {} },
      settings: {
        additional: "some-value",
      },
    }
    validateConfig(config)
    expect((config.settings as any).timezone).toEqual("UTC")
    expect(config.settings.additional).toBeUndefined()
  })
  it("should report missing properties in config root", () => {
    validateConfig({})
    const expected = [
      {
        keyword: "required",
        params: {
          missingProperty: "global",
        },
        schemaPath: "#/required",
      },
      {
        keyword: "required",
        params: {
          missingProperty: "settings",
        },
        schemaPath: "#/required",
      },
    ]
    expect(validateConfig.errors).toMatchObject(expected)
  })
  test.todo(
    "should remove additional properties (unsupported: see https://ajv.js.org/guide/modifying-data.html#general-considerations)",
  )
  // it("should remove additional properties", () => {
  //   const config = {
  //     rules: [],
  //     additional: "some-value",
  //   }
  //   expect(validateConfig(validateConfig.errors)).toBeFalsy()
  //   expect(config.additional).toBeUndefined()
  // })
})
