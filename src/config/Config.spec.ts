import { Config } from "./Config"
import { MockFactory } from "../../test/mocks/MockFactory"
// import * as schema from "../schema-draft-6.json"
// import { defaults } from "json-schema-defaults"
import { plainToClass } from "class-transformer"

it("Schema-generated Config Types Test", () => {
  const cfg = plainToClass(Config, MockFactory.newDefaultConfig())
  expect(cfg.settings?.timezone).toBe("UTC")
})

// it('Should use default values from JSON schema', () => {
//     const defaultConfig = defaults(schema) as Config
//     expect(defaultConfig.settings.timezone).toBe("UTC")
// })
