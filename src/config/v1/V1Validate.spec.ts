import { validateV1Config } from "./V1Validate"

describe("validate()", () => {
  it("should validate a minimum compliant v1 config without errors", () => {
    validateV1Config({ rules: [] })
    expect(validateV1Config.errors).toBeFalsy()
  })
  it("should validate compliant v1 config without errors", () => {
    validateV1Config({
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
    const expected = [
      {
        keyword: "required",
        params: { missingProperty: "rules" },
      },
    ]
    expect(validateV1Config.errors).toMatchObject(expected)
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
