import { MockFactory, Mocks } from "../test/mocks/MockFactory"
import { jsonToConfig } from "./config/Config"
import { GmailProcessor } from "./processors/GmailProcessor"

let configJson: Record<string, unknown>
let mocks: Mocks
let gmailProcessor: GmailProcessor

beforeEach(() => {
  configJson = MockFactory.newDefaultConfigJson()
  const config = jsonToConfig(configJson)
  mocks = MockFactory.newMocks(config, true)
  gmailProcessor = new GmailProcessor(mocks.envContext)
})

describe("run", () => {
  it("test", () => {
    console.log("Processing started ...")
    gmailProcessor.runWithConfigJson(configJson, true)
    console.log("Processing finished ...")
  })
})
