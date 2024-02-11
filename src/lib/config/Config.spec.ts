/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import {
  Config,
  ProcessingConfig,
  configToJson,
  essentialConfig,
  newConfig,
  normalizeConfig,
} from "./Config"
import {
  DEFAULT_SETTING_MAX_BATCH_SIZE,
  DEFAULT_SETTING_MAX_RUNTIME,
  DEFAULT_SETTING_SLEEP_TIME_THREADS,
  MarkProcessedMethod,
} from "./SettingsConfig"
// import * as configSchema from "../../schema-v2.json"
// import { defaults } from "json-schema-defaults"

it("New instance should contain defaults", () => {
  const cfg = newConfig({
    settings: {
      markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
    },
    threads: [{}],
  })
  expect(cfg.description).toEqual("")
  expect(cfg.threads).toMatchObject([{}])
})

it("Schema-generated Config Types Test", () => {
  const cfg = ConfigMocks.newDefaultConfig()
  expect(cfg.settings?.maxRuntime).toBe(DEFAULT_SETTING_MAX_RUNTIME)
})

describe("normalizeConfig", () => {
  it("should expand shorthand config", () => {
    const cfg = normalizeConfig({
      threads: [{ description: "Thread config 1" }],
      messages: [{ description: "Message config 1" }],
      attachments: [{ description: "Attachment config 1" }],
    }) as any
    expect(cfg.threads[0]?.description).toEqual("Thread config 1")
    expect(cfg.threads[1]?.messages[0]?.description).toEqual("Message config 1")
    expect(cfg.threads[1]?.messages[1]?.attachments[0]?.description).toEqual(
      "Attachment config 1",
    )
  })
})

describe("newConfig", () => {
  it("should set defaults for missing properties from JSON", () => {
    const expected: Record<string, any> = ConfigMocks.newDefaultConfig()
    const actual = newConfig(expected)
    expect(actual).toMatchObject(expected)
  })

  it("should create a nested config object from JSON", () => {
    const expected: ProcessingConfig = {
      global: {
        thread: {
          match: {
            query: "global-query newer_than:3m",
          },
        },
      },
      settings: {
        markProcessedMethod: MarkProcessedMethod.ADD_THREAD_LABEL,
        markProcessedLabel: "some-label",
      },
      threads: [
        {
          description: "Thread config 1",
          match: {
            query: "thread-query",
          },
          messages: [
            {
              description: "Message config 1",
              match: {
                subject: "subject-match",
              },
              attachments: [
                {
                  description: "Attachment config 1",
                  match: {
                    name: "attachment-match",
                  },
                  actions: [
                    {
                      name: "global.log",
                      args: {
                        message: "Log attachment",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }
    const actual = newConfig(expected)
    expect(actual).toMatchObject(expected)
  })
})

describe("configToJson", () => {
  it("should serialize config to JSON with default values", () => {
    const configJson: ProcessingConfig = {
      description: "config description",
      settings: {
        markProcessedMethod: MarkProcessedMethod.ADD_THREAD_LABEL,
        markProcessedLabel: "some label",
      },
      threads: [
        {
          description: "thread description",
        },
      ],
    }
    const expected: ProcessingConfig = {
      ...configJson,
      settings: {
        markProcessedMethod: MarkProcessedMethod.ADD_THREAD_LABEL,
        maxBatchSize: DEFAULT_SETTING_MAX_BATCH_SIZE,
        maxRuntime: DEFAULT_SETTING_MAX_RUNTIME,
        sleepTimeThreads: DEFAULT_SETTING_SLEEP_TIME_THREADS,
      },
    }
    const cfg = newConfig(configJson)
    const actual = configToJson(cfg, true)
    expect(actual).toMatchObject(expected)
  })
})

it("should enforce required settings", () => {
  expect(() =>
    newConfig({
      threads: [{}],
    }),
  ).toThrowError("No markProcessedMethod not set in settings!")
})

it("should enforce required thread configs", () => {
  expect(() =>
    newConfig({
      settings: {
        markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
      },
    }),
  ).toThrowError("No thread configuration found")
})

it("should provide essential JSON config with defaults removed", () => {
  const config = newConfig({
    settings: {
      logSheetLocation: "",
      markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
      maxBatchSize: 100,
      maxRuntime: 280,
      sleepTimeAttachments: 1,
      sleepTimeMessages: 10,
      timezone: "default",
    },
    threads: [ConfigMocks.newDefaultThreadConfigJson()],
  })
  const actual = essentialConfig(config)
  expect(actual).toMatchObject({
    settings: {
      markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
      maxBatchSize: 100,
      sleepTimeAttachments: 1,
      sleepTimeMessages: 10,
    },
    threads: [
      {
        description: "A sample thread config",
        match: {
          minMessageCount: -1,
          query: "has:attachment from:example@example.com",
        },
        name: "default-thread-config",
      },
    ],
    global: {},
  } as Config)
  expect(actual.settings?.maxRuntime).toBeUndefined()
  expect(actual.settings?.timezone).toBeUndefined()
})
