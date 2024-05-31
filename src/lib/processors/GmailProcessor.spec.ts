import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import { GMailMocks } from "../../test/mocks/GMailMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { ProcessingStatus } from "../Context"
import { ProcessingStage } from "../config/ActionConfig"
import { Config, RequiredConfig } from "../config/Config"
import { LogLevel, MarkProcessedMethod } from "../config/SettingsConfig"
import { DEFAULT_GLOBAL_QUERY } from "../config/ThreadMatchConfig"
import { GmailProcessor } from "./GmailProcessor"

let config: RequiredConfig
let mocks: Mocks

beforeEach(() => {
  mocks = MockFactory.newMocks()
  config = mocks.processingContext.proc.config
})

describe("run", () => {
  mocks = MockFactory.newCustomMocks(
    ConfigMocks.newDefaultConfigJson(),
    GMailMocks.getGmailSampleData(),
    [0, 0, 0],
    [0, 0, 0],
  )
  it("should process a v2 config object", () => {
    const result = GmailProcessor.run(config, [], mocks.envContext)
    expect(mocks.envContext.env.gmailApp.search).toHaveBeenCalledTimes(
      config.threads.length,
    )
    const expectedResult = {
      processedAttachmentConfigs: 0,
      processedAttachments: 0,
      processedMessageConfigs: 1,
      processedMessages: 0,
      processedThreadConfigs: 1,
      processedThreads: 1,
      status: ProcessingStatus.OK,
    }
    expect(result).toMatchObject(expectedResult)
    expect(result.executedActions.length).toEqual(1)
    expect(result.error).toBeUndefined()
    expect(result.failedAction).toBeUndefined()
  })

  it("should throw error if an action cannot be executed", () => {
    config.threads[0].actions.unshift({
      name: "global.panic",
      args: {
        level: LogLevel.INFO,
        location: "GmailProcessor.spec",
        message: "Intended failing",
      },
      description: "Failing action",
      processingStage: ProcessingStage.PRE_MAIN,
    })
    expect(() => GmailProcessor.run(config, [], mocks.envContext)).toThrow(
      "Error in action 'global.panic'",
    )
  })
})

describe("getEffectiveConfig", () => {
  it("should enhance a minimal configuration with default values", () => {
    const simpleConfig = {
      settings: {
        markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
        timezone: "Europe/Vienna",
      },
      threads: [{}],
    }
    const expected: Config = {
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
