import { MockFactory } from "../../test/mocks/MockFactory"
import { Config, configToJson, jsonToConfig, normalizeConfig } from "./Config"
import { ThreadConfig } from "./ThreadConfig"
// import * as configSchema from "../../schema-v2.json"
// import { defaults } from "json-schema-defaults"

it("Schema-generated Config Types Test", () => {
  const cfg = MockFactory.newDefaultConfig()
  expect(cfg.settings?.timezone).toBe("UTC")
})

// it('Should use default values from JSON schema', () => {
//     const defaultConfig = defaults(schema) as Config
//     expect(defaultConfig.settings.timezone).toBe("UTC")
// })

describe("normalizeConfig", () => {
  it("should expand shorthand config", () => {
    const cfg = jsonToConfig({
      threadHandler: [{ description: "Thread handler 1" }],
      messageHandler: [{ description: "Message handler 1" }],
      attachmentHandler: [{ description: "Attachment handler 1" }],
    })
    const normCfg = normalizeConfig(cfg)
    const expected = {
      threadHandler: [
        { description: "Thread handler 1" },
        { messageHandler: [{ description: "Message handler 1" }] },
        {
          messageHandler: [
            { attachmentHandler: [{ description: "Attachment handler 1" }] },
          ],
        },
      ],
    }
    expect(normCfg).toMatchObject(expected)
    expect(normCfg.attachmentHandler).toEqual([])
    expect(normCfg.messageHandler).toEqual([])
  })
})

describe("jsonToConfig", () => {
  it("should set defaults for missing properties from JSON", () => {
    {
      const cfg: Record<string, any> = MockFactory.newDefaultConfig()
      const actual = jsonToConfig(cfg)
      expect(actual).toMatchObject(cfg)
    }
  })
  it("should remove additional properties from JSON", () => {
    {
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
    }
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
      threadHandler: [
        {
          description: "Thread Handler 1",
          match: {
            query: "thread-query",
          },
        },
      ],
    }
    const config = jsonToConfig(json)
    config.threadHandler[0].match.query
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
      threadHandler: [{ description: "thread description" }],
    }
    const cfg = new Config()
    cfg.description = expected.description
    cfg.settings.processedLabel = expected.settings.processedLabel
    const tcfg = new ThreadConfig()
    tcfg.description = expected.threadHandler[0].description
    cfg.threadHandler.push(tcfg)
    const actual = configToJson(cfg, true)
    expect((actual as any).settings.timezone).toEqual("UTC")
    expect(actual).toMatchObject(expected)
  })
  test.todo("should serialize config to JSON without default values")
  // it("should serialize config to JSON without default values", () => {
  //   const expected = {
  //     description: "config description",
  //     settings: {
  //       processedLabel: "some label",
  //     },
  //     threadHandler: [{ description: "thread description" }],
  //   }
  //   const cfg = new Config()
  //   cfg.description = expected.description
  //   cfg.settings.processedLabel = expected.settings.processedLabel
  //   const tcfg = new ThreadConfig()
  //   tcfg.description = expected.threadHandler[0].description
  //   cfg.threadHandler.push(tcfg)
  //   const actual = configToJson(cfg, false)
  //   expect(actual).toMatchObject(expected)
  //   expect((actual as any).settings?.processedMode).toBeUndefined()
  // })
})
