import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import { GMailMocks } from "../../test/mocks/GMailMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { ProcessingStatus, newProcessingResult } from "../Context"
import { ProcessingStage } from "../config/ActionConfig"
import { Config, RequiredConfig } from "../config/Config"
import { LogLevel, MarkProcessedMethod } from "../config/SettingsConfig"
import { DEFAULT_GLOBAL_QUERY } from "../config/ThreadMatchConfig"
import { GmailProcessor } from "./GmailProcessor"

let config: RequiredConfig
let mocks: Mocks

beforeAll(() => {
  mocks = MockFactory.newMocks()
  config = mocks.processingContext.proc.config
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe("run", () => {
  beforeEach(() => {
    mocks = MockFactory.newCustomMocks(
      ConfigMocks.newDefaultConfigJson(),
      GMailMocks.getGmailSampleData(),
      [0, 0, 0],
      [0, 0, 0],
    )
  })
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

  it("should output JSON report format", () => {
    const freshMocks = MockFactory.newMocks()

    const freshConfig = freshMocks.processingContext.proc.config
    const spyInfo = jest.spyOn(freshMocks.envContext.log, "info")
    GmailProcessor.run(freshConfig, [], freshMocks.envContext, "json")
    expect(spyInfo).toHaveBeenCalledWith(expect.stringContaining("{"))
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

describe("getEssentialConfig", () => {
  it("should return only essential config fields", () => {
    const cfg = ConfigMocks.newDefaultConfigJson()
    const essential = GmailProcessor.getEssentialConfig(cfg)
    expect(essential).toBeDefined()
  })
})

describe("checkTimezone", () => {
  it("should log an error when config timezone mismatches script timezone", () => {
    const freshMocks = MockFactory.newMocks()
    const spyError = jest.spyOn(freshMocks.envContext.log, "error")
    ;(
      freshMocks.envContext.env.session.getScriptTimeZone as jest.Mock
    ).mockReturnValue("America/New_York")
    const tzConfig = GmailProcessor.getEffectiveConfig({
      settings: {
        markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
        timezone: "Europe/Vienna",
      },
      threads: [{}],
    })
    GmailProcessor.run(tzConfig, [], freshMocks.envContext)
    expect(spyError).toHaveBeenCalledWith(
      expect.stringContaining("inconsistent with Google Apps Script"),
    )
  })

  it("should not log a timezone error when timezones match", () => {
    const freshMocks = MockFactory.newMocks()
    const spyError = jest.spyOn(freshMocks.envContext.log, "error")
    ;(
      freshMocks.envContext.env.session.getScriptTimeZone as jest.Mock
    ).mockReturnValue("Europe/Vienna")
    const tzConfig = GmailProcessor.getEffectiveConfig({
      settings: {
        markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
        timezone: "Europe/Vienna",
      },
      threads: [{}],
    })
    GmailProcessor.run(tzConfig, [], freshMocks.envContext)
    expect(spyError).not.toHaveBeenCalledWith(
      expect.stringContaining("inconsistent"),
    )
  })
})

describe("buildMetaInfo with property-type variables", () => {
  it("should warn when a property-type variable value is not set", () => {
    const freshMocks = MockFactory.newMocks()
    const spyWarn = jest.spyOn(freshMocks.envContext.log, "warn")
    ;(
      freshMocks.envContext.env.propertiesService.getScriptProperties()
        .getProperty as jest.Mock
    ).mockReturnValue(null)

    const cfgWithPropVar = GmailProcessor.getEffectiveConfig({
      settings: {
        markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
      },
      global: {
        variables: [{ key: "myVar", value: "MISSING_PROP", type: "property" }],
      },
      threads: [{}],
    })
    GmailProcessor.run(cfgWithPropVar, [], freshMocks.envContext)
    expect(spyWarn).toHaveBeenCalledWith(
      expect.stringContaining("MISSING_PROP"),
    )
  })

  it("should resolve property-type variables when the property exists", () => {
    const freshMocks = MockFactory.newMocks()
    ;(
      freshMocks.envContext.env.propertiesService.getScriptProperties()
        .getProperty as jest.Mock
    ).mockReturnValue("resolved-value")

    const cfgWithPropVar = GmailProcessor.getEffectiveConfig({
      settings: {
        markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
      },
      global: {
        variables: [{ key: "myVar", value: "EXISTING_PROP", type: "property" }],
      },
      threads: [{}],
    })
    const result = GmailProcessor.run(cfgWithPropVar, [], freshMocks.envContext)
    expect(result.status).toBe(ProcessingStatus.OK)
  })
})

it("should report non-OK status in reportResults", () => {
  const freshMocks = MockFactory.newMocks()
  const spyError = jest.spyOn(freshMocks.envContext.log, "error")
  const result = newProcessingResult()
  result.status = ProcessingStatus.ERROR
  result.failedAction = {
    config: { name: "test-action" } as any,
    result: { ok: false },
  }
  result.error = new Error("test-error")

  GmailProcessor["reportResults"](freshMocks.envContext, result, "text")

  expect(spyError).toHaveBeenCalledWith(
    expect.stringContaining("There have been errors during processing"),
  )
  expect(spyError).toHaveBeenCalledWith(expect.stringContaining("test-action"))
  expect(spyError).toHaveBeenCalledWith(expect.stringContaining("test-error"))
})
