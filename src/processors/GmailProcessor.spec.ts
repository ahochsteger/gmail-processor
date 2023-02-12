import { Mocks } from "../../test/mocks/Mocks"
import { anyString } from "jest-mock-extended"
import { MockFactory } from "../../test/mocks/MockFactory"
import { GmailProcessor } from "./GmailProcessor"
import { Config } from "../config/Config"

let config: Config
let mocks: Mocks
let gmailProcessor: GmailProcessor

beforeEach(() => {
  config = MockFactory.newDefaultConfig()
  mocks = new Mocks(config, true)
  gmailProcessor = new GmailProcessor(mocks.gasContext)
})

describe("run", () => {
  it("should process the thread rules", () => {
    mocks.gmailApp.search
      .calledWith(anyString(), 1, config.settings.maxBatchSize)
      .mockReturnValue([])
    gmailProcessor.run(config, true)
    expect(mocks.gasContext.gmailApp.search).toHaveBeenCalledTimes(
      config.threadHandler.length,
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
            type: "global",
          },
          threadHandler: [],
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
