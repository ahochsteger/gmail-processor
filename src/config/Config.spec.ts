import { plainToInstance } from "class-transformer"
import { Config } from "./Config"
import { MockFactory } from "../../test/mocks/MockFactory"

it("should map values from JSON", () => {
  const config = plainToInstance(Config, MockFactory.newDefaultSettingsJson())
  const expectedConfig = new Config()
  expectedConfig.threadRules = []
  expect(config).toEqual(expectedConfig)
})
