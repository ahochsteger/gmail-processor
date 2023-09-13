import { PartialDeep } from "type-fest"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { ProcessingStatus } from "../Context"
import { ProcessingStage } from "../config/ActionConfig"
import { Config, RequiredConfig } from "../config/Config"
import { DEFAULT_GLOBAL_QUERY } from "../config/GlobalConfig"
import { MarkProcessedMethod } from "../config/SettingsConfig"
import { GmailProcessor } from "./GmailProcessor"

let config: RequiredConfig
let mocks: Mocks

beforeEach(() => {
  mocks = MockFactory.newMocks()
  config = mocks.processingContext.proc.config
})

describe("run", () => {
  it("should process a v2 config object", () => {
    const result = GmailProcessor.run(config, mocks.envContext)
    expect(mocks.envContext.env.gmailApp.search).toHaveBeenCalledTimes(
      config.threads.length,
    )
    const expectedResult = {
      processedAttachmentConfigs: 0,
      processedAttachments: 0,
      processedMessageConfigs: 2,
      processedMessages: 0,
      processedThreadConfigs: 3,
      processedThreads: 3,
      status: ProcessingStatus.OK,
    }
    expect(result).toMatchObject(expectedResult)
    expect(result.executedActions.length).toEqual(1)
    expect(result.error).toBeUndefined()
    expect(result.failedAction).toBeUndefined()
  })

  it("should throw error if an action cannot be executed", () => {
    config.threads[0].actions.unshift({
      name: "",
      args: {},
      description: "Failing action",
      processingStage: ProcessingStage.PRE_MAIN,
    })
    expect(() => GmailProcessor.run(config, mocks.envContext)).toThrow()
  })

  // it("should stop processing and return with an error result if action can be executed but thows an error", () => {
  //   config.threads[0].actions.unshift({
  //     name: "thread.storePDF",
  //     args: {},
  //     description: "Failing action",
  //     processingStage: ProcessingStage.PRE_MAIN,
  //   })
  //   const result = GmailProcessor.run(config, mocks.envContext)
  //   const expectedResult = {
  //     processedAttachmentConfigs: 0,
  //     processedAttachments: 0,
  //     processedMessageConfigs: 0,
  //     processedMessages: 0,
  //     processedThreadConfigs: 0,
  //     processedThreads: 0,
  //     status: ProcessingStatus.ERROR,
  //   }
  //   expect(result).toMatchObject(expectedResult)
  //   expect(result.executedActions.length).toEqual(1)
  //   expect(result.error).toBeUndefined()
  //   expect(result.failedAction).toBeUndefined()
  // })
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
