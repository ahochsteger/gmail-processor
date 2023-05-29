/* eslint-disable @typescript-eslint/no-explicit-any */
import { PartialDeep } from "type-fest"
import { MockFactory } from "../../test/mocks/MockFactory"
import {
  ProcessingConfig,
  RequiredConfig,
  configToJson,
  jsonToConfig,
  newConfig,
  normalizeConfig,
} from "./Config"
import {
  DEFAULT_SETTING_MAX_BATCH_SIZE,
  DEFAULT_SETTING_MAX_RUNTIME,
  DEFAULT_SETTING_SLEEP_TIME_THREADS,
} from "./SettingsConfig"
// import * as configSchema from "../../schema-v2.json"
// import { defaults } from "json-schema-defaults"

it("New instance should contain defaults", () => {
  const cfg = newConfig() as RequiredConfig
  expect(cfg.description).toEqual("")
  expect(cfg.threads).toEqual([])
})

it("Schema-generated Config Types Test", () => {
  const cfg = MockFactory.newDefaultConfig()
  expect(cfg.settings?.maxRuntime).toBe(DEFAULT_SETTING_MAX_RUNTIME)
})

// it('Should use default values from JSON schema', () => {
//     const defaultConfig = defaults(schema) as Config
//     expect(defaultConfig.settings.timezone).toBe("UTC")
// })

describe("normalizeConfig", () => {
  it("should expand shorthand config", () => {
    const cfg = normalizeConfig({
      threads: [{ description: "Thread config 1" }],
      messages: [{ description: "Message config 1" }],
      attachments: [{ description: "Attachment config 1" }],
    }) as any
    expect(cfg.threads[0].description).toEqual("Thread config 1")
    expect(cfg.threads[1]?.messages[0]?.description).toEqual("Message config 1")
    expect(cfg.threads[2].messages[0].attachments[0].description).toEqual(
      "Attachment config 1",
    )
  })
})

describe("jsonToConfig", () => {
  it("should set defaults for missing properties from JSON", () => {
    const expected: Record<string, any> = MockFactory.newDefaultConfig()
    const actual = jsonToConfig(expected)
    expect(actual).toMatchObject(expected)
  })

  it("should remove additional properties from JSON", () => {
    const expected: PartialDeep<ProcessingConfig> = {
      global: {
        thread: {
          match: {
            query: "global-query",
          },
        },
      },
      settings: {
        markProcessedLabel: "processed-label",
      },
    }
    const cfgJson = { ...expected, additionalProperty: "additional" }
    const actual = jsonToConfig(cfgJson)
    expect((actual as any).additionalProperty).toBeUndefined()
    expect(actual).toMatchObject(expected)
  })

  it("should create a nested config object from JSON", () => {
    const expected: PartialDeep<ProcessingConfig> = {
      global: {
        thread: {
          match: {
            query: "global-query",
            newerThan: "3m",
          },
        },
      },
      settings: {
        markProcessedLabel: "some-label",
      },
      threads: [
        {
          description: "Thread Handler 1",
          match: {
            query: "thread-query",
          },
        },
      ],
    }
    const actual = jsonToConfig(expected)
    expect(actual).toMatchObject(expected)
  })
})

describe("configToJson", () => {
  it("should serialize config to JSON with default values", () => {
    const configJson: PartialDeep<ProcessingConfig> = {
      description: "config description",
      settings: {
        markProcessedLabel: "some label",
      },
      threads: [{ description: "thread description" }],
    }
    const expected: PartialDeep<ProcessingConfig> = {
      ...configJson,
      settings: {
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
