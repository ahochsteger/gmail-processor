import { PartialDeep } from "type-fest"
import { runWithV1Config } from "."
import { ConfigMocks } from "../test/mocks/ConfigMocks"
import { ContextMocks } from "../test/mocks/ContextMocks"
import { MockFactory, Mocks } from "../test/mocks/MockFactory"
import { RunMode } from "./Context"
import { Config, newConfig } from "./config/Config"
import { GmailProcessor } from "./processors/GmailProcessor"

let configJson: PartialDeep<Config>
let mocks: Mocks
let gmailProcessor: GmailProcessor

beforeEach(() => {
  configJson = ConfigMocks.newDefaultConfigJson()
  const config = newConfig(configJson)
  mocks = MockFactory.newMocks(config, RunMode.DANGEROUS)
  gmailProcessor = new GmailProcessor()
})

describe("run", () => {
  it("test", () => {
    const result = gmailProcessor.runWithJson(configJson, mocks.envContext)
    expect(result.status).toEqual("ok")
  })
})

describe("runWithV1ConfigJson", () => {
  it("should process a v1 config JSON", () => {
    const v1config = ConfigMocks.newDefaultV1ConfigJson()
    const result = runWithV1Config(
      v1config,
      RunMode.DANGEROUS,
      ContextMocks.newEnvContextMock(),
    )
    expect(result.status).toEqual("ok")
  })
})
