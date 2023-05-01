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
    gmailProcessor.runWithConfigJson(
      mocks.envContext,
      configJson,
      RunMode.DRY_RUN,
    )
    console.log("Processing finished ...")
  })
})
