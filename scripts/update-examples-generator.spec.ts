import { readFileSync } from "fs"
import { ExampleHandler } from "./update-examples-generator"

let eh: ExampleHandler
beforeAll(() => {
  const libSymbols = ExampleHandler.extractExportedSymbolds(
    readFileSync("src/lib/index.ts").toString(),
  )
  eh = new ExampleHandler(
    "../..",
    "src/templates",
    "src/examples",
    [],
    [
      {
        deprecated: false,
        deprecationInfo: "",
        description: "",
        name: "ExampleVariant",
        values: [
          {
            deprecated: false,
            deprecationInfo: "",
            description: "",
            key: "CUSTOM_ACTIONS",
            value: "custom-actions",
          },
          {
            deprecated: false,
            deprecationInfo: "",
            description: "",
            key: "MIGRATION_V1",
            value: "migration-v1",
          },
        ],
      },
    ],
    libSymbols,
  )
})

describe("ExampleHandler", () => {
  it("should eliminate import statements for E2E tests", () => {
    const code = eh.genE2eTestCode(
      readFileSync("src/examples/advanced/customActions.ts").toString(),
    )
    expect(code).not.toEqual("")
    expect(code).not.toMatch(/^import/)
  })
})
