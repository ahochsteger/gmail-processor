/* eslint-disable @typescript-eslint/no-explicit-any */
import { PartialDeep } from "type-fest"
import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import {
  EXISTING_FILE_NAME,
  EXISTING_FOLDER_NAME,
} from "../../test/mocks/GDriveMocks"
import {
  Config,
  ProcessingConfig,
  RequiredConfig,
  configToJson,
  essentialConfig,
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
  const cfg = newConfig({ threads: [{}] }) as RequiredConfig
  expect(cfg.description).toEqual("")
  expect(cfg.threads).toMatchObject([{}])
})

it("Schema-generated Config Types Test", () => {
  const cfg = ConfigMocks.newDefaultConfig()
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

  // TODO: Disabled option 'excludeExtraneousValues: true' since it causes nested data to get lost
  // it("should remove additional properties from JSON", () => {
  //   const expected: PartialDeep<ProcessingConfig> = {
  //     global: {
  //       thread: {
  //         match: {
  //           query: "global-query",
  //         },
  //       },
  //     },
  //     settings: {
  //       markProcessedLabel: "processed-label",
  //     },
  //   }
  //   const cfgJson = { ...expected, additionalProperty: "additional" }
  //   const actual = newConfig(cfgJson)
  //   expect((actual as any).additionalProperty).toBeUndefined()
  //   expect(actual).toMatchObject(expected)
  // })

  it("should create a nested config object from JSON", () => {
    const expected: PartialDeep<ProcessingConfig> = {
      global: {
        thread: {
          match: {
            query: "global-query newer_than:3m",
          },
        },
      },
      settings: {
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
    const configJson: PartialDeep<ProcessingConfig> = {
      description: "config description",
      settings: {
        markProcessedLabel: "some label",
      },
      threads: [
        {
          description: "thread description",
        },
      ],
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

it("should provide essential JSON config with defaults removed", () => {
  const config = newConfig(ConfigMocks.newDefaultConfigJson())
  const actual = essentialConfig(config)
  expect(actual).toMatchObject({
    settings: {
      markProcessedLabel: "to-gdrive/processed",
      maxBatchSize: 100,
      sleepTimeAttachments: 1,
      sleepTimeMessages: 10,
      timezone: "UTC",
    },
    threads: [
      {
        match: {
          query: "has:attachment from:example4@example.com",
        },
        messages: [
          {
            actions: [
              {
                name: "message.markRead",
              },
            ],
            attachments: [
              {
                actions: [
                  {
                    args: {
                      conflictStrategy: "replace",
                      location: `${EXISTING_FOLDER_NAME}/\${message.subject.match.1}/\${email.subject} - \${match.att.1}.jpg`,
                    },
                    name: "attachment.store",
                  },
                ],
                match: {
                  contentType: "application/(?<appType>.*)",
                  name: "attachment(?<attNr>[0-9]+)\\.pdf",
                },
              },
              {
                actions: [
                  {
                    args: {
                      conflictStrategy: "skip",
                      location:
                        "Folder3/Subfolder3/${att.basename}-${date:yyyy-MM-dd}.${att.ext}",
                    },
                    name: "attachment.store",
                  },
                ],
                match: {
                  name: "Image-([0-9]+)\\.jpg",
                },
              },
            ],
            match: {
              from: "(.+)@example.com",
              is: ["read"],
              subject: "Message (?<myMatchGroup>.*)",
              to: "my\\.address\\+(.+)@gmail.com",
            },
          },
        ],
      },
      {
        description:
          "Example that stores all attachments of matching messages to a certain GDrive folder",
        match: {
          query: "has:attachment from:example@example.com",
        },
        messages: [
          {
            actions: [
              {
                args: {
                  location: `/${EXISTING_FOLDER_NAME}/${EXISTING_FILE_NAME}`,
                },
                name: "message.storePDF",
              },
            ],
            match: {
              from: "(.+)@example.com",
              subject: "Prefix - (?<prefix>.*) - Suffix(?<suffix>.*)",
              to: "my\\.address\\+(.+)@gmail.com",
            },
          },
        ],
      },
      {
        actions: [
          {
            args: {
              location: `/${EXISTING_FOLDER_NAME}/${EXISTING_FILE_NAME}`,
            },
            name: "thread.storePDF",
          },
        ],
        description:
          "Example that stores all attachments of all found threads to a certain GDrive folder",
        match: {
          query: "has:attachment from:example@example.com",
        },
      },
    ],
    global: {},
  } as Config)
})
