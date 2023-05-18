import { runWithV1Config } from "."
import { MockFactory, Mocks } from "../test/mocks/MockFactory"
import { RunMode } from "./Context"
import { jsonToConfig } from "./config/Config"
import { GmailProcessor } from "./processors/GmailProcessor"

let configJson: Record<string, unknown>
let mocks: Mocks
let gmailProcessor: GmailProcessor

beforeEach(() => {
  configJson = MockFactory.newDefaultConfigJson()
  const config = jsonToConfig(configJson)
  mocks = MockFactory.newMocks(config, RunMode.DRY_RUN)
  gmailProcessor = new GmailProcessor()
})

describe("run", () => {
  it("test", () => {
    console.log("Processing started ...")
    gmailProcessor.runWithJson(configJson, RunMode.DRY_RUN, mocks.envContext)
    console.log("Processing finished ...")
  })
})

describe("runWithV1ConfigJson", () => {
  it("should process a v1 config JSON", () => {
    const v1config = MockFactory.newDefaultV1ConfigJson()
    runWithV1Config(v1config, RunMode.DRY_RUN, MockFactory.newEnvContextMock())
  })
})
