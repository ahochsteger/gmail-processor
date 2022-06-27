import { plainToInstance } from "class-transformer"
import { Config } from "./Config"
import { MockFactory } from "../../test/mocks/MockFactory"
import { ThreadRule } from "./ThreadRule"

it("should map values from JSON", () => {
  const config = plainToInstance(Config, MockFactory.newDefaultSettingsJson(true))
  const expectedConfig = new Config()
  expectedConfig.globalFilter = "has:attachment -in:trash -in:drafts -in:spam"
  expectedConfig.maxRuntime = 280
  expectedConfig.newerThan = "1m"
  expectedConfig.processedLabel = "to-gdrive/processed"
  expectedConfig.sleepTime = 100
  expectedConfig.timezone = "GMT"
  const expectedThreadRule = new ThreadRule()
  expectedThreadRule.description = "A sample thread rule"
  expectedThreadRule.filter = "has:attachment from:example@example.com"
  expectedConfig.threadRules = [ expectedThreadRule ]
  expect(config).toEqual(expectedConfig)
})
