import { MockFactory, Mocks } from "../test/mocks/MockFactory"
import { Config } from "./config/Config"
import { GmailProcessor } from "./processors/GmailProcessor"

let config: Config
let mocks: Mocks
let gmailProcessor: GmailProcessor

beforeEach(() => {
  config = MockFactory.newDefaultConfig()
  mocks = MockFactory.newMocks(config, true)
  gmailProcessor = new GmailProcessor(mocks.envContext)
})

describe("run", () => {
  it("test", () => {
    console.log("Processing started ...")
    gmailProcessor.runWithConfigJson(config, true)
    console.log("Processing finished ...")
  })
})
