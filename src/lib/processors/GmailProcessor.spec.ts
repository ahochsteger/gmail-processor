import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { RunMode } from "../Context"
import { RequiredConfig } from "../config/Config"
import { GmailProcessor } from "./GmailProcessor"

let config: RequiredConfig
let mocks: Mocks
let gmailProcessor: GmailProcessor

beforeEach(() => {
  config = MockFactory.newDefaultConfig()
  mocks = MockFactory.newMocks(config as RequiredConfig, RunMode.DRY_RUN)
  gmailProcessor = new GmailProcessor()
})

describe("run", () => {
  it("should process a v2 config object", () => {
    gmailProcessor.run(config, mocks.envContext)
    expect(mocks.envContext.env.gmailApp.search).toHaveBeenCalledTimes(
      config.threads.length,
    )
  })
})

describe("getEffectiveConfig", () => {
  it("should enhance a minimal configuration with default values", () => {
    const simpleConfig = {
      settings: {
        timezone: "Europe/Vienna",
      },
    }
    const actual = gmailProcessor.getEffectiveConfig(simpleConfig)
    expect(JSON.stringify(actual, null, 2)).toEqual(
      JSON.stringify(
        {
          description: "",
          global: {
            match: {
              query: "",
              maxMessageCount: -1,
              minMessageCount: 1,
              newerThan: "",
            },
            actions: [],
          },
          threads: [],
          settings: {
            logSheetFile: "Gmail2GDrive/Gmail2GDrive-logs",
            logSheetFolderId: "",
            maxBatchSize: 10,
            maxRuntime: 280,
            processedLabel: "to-gdrive/processed",
            processedMode: "read",
            sleepTimeThreads: 100,
            sleepTimeMessages: 0,
            sleepTimeAttachments: 0,
            timezone: "Europe/Vienna",
          },
        },
        null,
        2,
      ),
    )
  })
})
