import { MockFactory } from "../../../test/mocks/MockFactory"
import { validateV1Config } from "./V1Validate"

describe("validate()", () => {
  it("should validate a minimum compliant v1 config without errors", () => {
    validateV1Config({
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
    expect(validateV1Config.errors).toBeFalsy()
  })
  it("should validate compliant v1 config without errors", () => {
    validateV1Config({
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
    expect(validateV1Config.errors).toBeFalsy()
  })
  it("should report missing rules", () => {
    validateV1Config({})
    expect(validateV1Config.errors?.length).toEqual(6)
  })
  it("should validate all MockFactory v1 config JSON without errors", () => {
    validateV1Config(MockFactory.newDefaultV1ConfigJson())
    expect(validateV1Config.errors).toBeNull()
  })
  test.todo(
    "should remove additional properties (unsupported: see https://ajv.js.org/guide/modifying-data.html#general-considerations)",
  )
})
