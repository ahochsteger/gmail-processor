import { PartialDeep } from "type-fest"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { ProcessingStage } from "../config/ActionConfig"
import { Config, RequiredConfig } from "../config/Config"
import { DEFAULT_GLOBAL_QUERY } from "../config/GlobalConfig"
import { MarkProcessedMethod } from "../config/SettingsConfig"
import { GmailProcessor } from "./GmailProcessor"

let config: RequiredConfig
let mocks: Mocks
let gmailProcessor: GmailProcessor

beforeEach(() => {
  mocks = MockFactory.newMocks()
  config = mocks.processingContext.proc.config
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
      threads: [{}],
    }
    const expected: PartialDeep<Config> = {
      description: "",
      global: {
        thread: {
          match: {
            query: DEFAULT_GLOBAL_QUERY,
            maxMessageCount: -1,
            minMessageCount: 1,
          },
          actions: [],
        },
        message: {
          actions: [
            {
              args: {},
              description: "",
              name: "message.markRead",
              processingStage: ProcessingStage.POST_MAIN,
            },
          ],
        },
        attachment: { actions: [] },
      },
      threads: [{}],
      settings: {
        logSheetLocation: "",
        maxBatchSize: 10,
        maxRuntime: 280,
        markProcessedLabel: "",
        markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
        sleepTimeThreads: 100,
        sleepTimeMessages: 0,
        sleepTimeAttachments: 0,
        timezone: "Europe/Vienna",
      },
    }
    const actual = GmailProcessor.getEffectiveConfig(simpleConfig)
    expect(actual).toMatchObject(expected)
  })
})
