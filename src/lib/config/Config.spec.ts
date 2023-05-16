/* eslint-disable @typescript-eslint/no-explicit-any */
import { MockFactory } from "../../test/mocks/MockFactory"
import {
  RequiredConfig,
  configToJson,
  jsonToConfig,
  newConfig,
  normalizeConfig,
} from "./Config"
import { DEFAULT_SETTING_MAX_RUNTIME } from "./SettingsConfig"
import { newThreadConfig } from "./ThreadConfig"
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
    const cfg: Record<string, any> = MockFactory.newDefaultConfig()
    const actual = jsonToConfig(cfg)
    expect(actual).toMatchObject(cfg)
  })
  it("should remove additional properties from JSON", () => {
    const expected = {
      global: {
        match: {
          query: "global-query",
        },
      },
      settings: {
        processedLabel: "processed-label",
      },
    }
    const cfgJson = { ...expected, additionalProperty: "additional" }
    const actual = jsonToConfig(cfgJson)
    expect((actual as any).additionalProperty).toBeUndefined()
    expect(actual).toMatchObject(expected)
  })
  it("should create a nested config object from JSON", () => {
    const json = {
      global: {
        match: {
          query: "global-query",
          newerThan: "3m",
        },
      },
      settings: {
        processedLabel: "some-label",
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
    const config = jsonToConfig(json)
    config.threads[0].match.query
    expect(config.global.match.query).toEqual(json.global.match.query)
    expect(config.settings.processedLabel).toEqual(json.settings.processedLabel)
  })
})

describe("configToJson", () => {
  it("should serialize config to JSON with default values", () => {
    const expected = {
      description: "config description",
      settings: {
        processedLabel: "some label",
      },
      threads: [{ description: "thread description" }],
    }
    const cfg = newConfig()
    cfg.description = expected.description
    cfg.settings.processedLabel = expected.settings.processedLabel
    const tcfg = newThreadConfig()
    tcfg.description = expected.threads[0].description
    cfg.threads.push(tcfg)
    const actual = configToJson(cfg, true)
    expect((actual as any).settings.maxRuntime).toEqual(
      DEFAULT_SETTING_MAX_RUNTIME,
    )
    expect(actual).toMatchObject(expected)
  })
  test.todo("should serialize config to JSON without default values")
  // it("should serialize config to JSON without default values", () => {
  //   const expected = {
  //     description: "config description",
  //     settings: {
  //       processedLabel: "some label",
  //     },
  //     threads: [{ description: "thread description" }],
  //   }
  //   const cfg = newConfig()
  //   cfg.description = expected.description
  //   cfg.settings.processedLabel = expected.settings.processedLabel
  //   const tcfg = newThreadConfig()
  //   tcfg.description = expected.threads[0].description
  //   cfg.threads.push(tcfg)
  //   const actual = configToJson(cfg, false)
  //   expect(actual).toMatchObject(expected)
  //   expect((actual as any).settings?.processedMode).toBeUndefined()
  // })
})
