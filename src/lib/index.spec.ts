import { convertV1Config, run } from "."
import { ConfigMocks } from "../test/mocks/ConfigMocks"
import { MockFactory, Mocks } from "../test/mocks/MockFactory"
import { ProcessingStatus, RunMode } from "./Context"
import { Config, newConfig } from "./config/Config"

let configJson: Config
let mocks: Mocks

beforeAll(() => {
  configJson = ConfigMocks.newDefaultConfigJson()
  mocks = MockFactory.newMocks(newConfig(configJson), RunMode.DANGEROUS)
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe("run", () => {
  it("test", () => {
    const result = run(configJson, RunMode.DANGEROUS, [], mocks.envContext)
    expect(result).toMatchObject({
      status: ProcessingStatus.OK,
    })
  })

  it("should use default context if none is provided", () => {
    // Mock GAS globals needed for defaultContext
    const mockGlobals = [
      "CacheService",
      "DriveApp",
      "DocumentApp",
      "Drive",
      "GmailApp",
      "MailApp",
      "SpreadsheetApp",
      "Utilities",
      "Session",
      "UrlFetchApp",
      "PropertiesService",
    ]
    mockGlobals.forEach((g) => {
      ;(global as any)[g] = {
        getScriptCache: () => ({ get: () => null, put: () => {} }),
        getScriptTimeZone: () => "UTC",
        getActiveUser: () => ({ getEmail: () => "test@example.com" }),
        getUuid: () => "mock-uuid",
        search: () => [],
      }
    })
    const mockFolder = {
      getFoldersByName: () => ({ hasNext: () => false }),
      createFolder: () => mockFolder,
      getFilesByName: () => ({ hasNext: () => false }),
    }
    const mockFile = { moveTo: () => {}, getUrl: () => "http://log" }
    ;(global as any).DriveApp.getRootFolder = () => mockFolder
    ;(global as any).DriveApp.getFileById = () => mockFile
    const mockSheet = { appendRow: () => {} }
    const mockSpreadsheet = {
      getId: () => "sheet-id",
      getSheets: () => [mockSheet],
    }
    ;(global as any).SpreadsheetApp.create = () => mockSpreadsheet
    ;(global as any).SpreadsheetApp.openById = () => mockSpreadsheet

    // We expect it to call GmailProcessor.runWithJson
    const result = run(configJson, RunMode.SAFE_MODE)
    expect(result.status).toEqual(ProcessingStatus.OK)

    // Cleanup
    mockGlobals.forEach((g) => {
      delete (global as any)[g]
    })
  })
})

describe("v1 config compatibility", () => {
  const expectedConfig = {
    settings: {
      markProcessedLabel: "gmail2gdrive/client-test",
    },
    threads: [
      {
        messages: [
          {
            attachments: [
              {
                actions: [
                  {
                    args: {
                      conflictStrategy: "keep",
                      description:
                        "Mail title: {{message.subject}}\nMail date: {{message.date}}\nMail link: https://mail.google.com/mail/u/0/#inbox/{{message.id}}",
                      location:
                        "/Scans-{{message.date|formatDate('yyyy-MM-dd')}}/{{attachment.name}}",
                    },
                    name: "attachment.store",
                  },
                ],
              },
            ],
          },
        ],
        match: {
          query: "to:my.name+scans@gmail.com",
        },
      },
      {
        messages: [
          {
            attachments: [
              {
                actions: [
                  {
                    args: {
                      conflictStrategy: "keep",
                      description:
                        "Mail title: {{message.subject}}\nMail date: {{message.date}}\nMail link: https://mail.google.com/mail/u/0/#inbox/{{message.id}}",
                      location: "/Examples/example1/{{attachment.name}}",
                    },
                    name: "attachment.store",
                  },
                ],
              },
            ],
          },
        ],
        match: {
          query: "from:example1@example.com",
        },
      },
      {
        messages: [
          {
            attachments: [
              {
                actions: [
                  {
                    args: {
                      conflictStrategy: "keep",
                      description:
                        "Mail title: {{message.subject}}\nMail date: {{message.date}}\nMail link: https://mail.google.com/mail/u/0/#inbox/{{message.id}}",
                      location:
                        "/Examples/example2/{{attachment.name.match.1}}",
                    },
                    name: "attachment.store",
                  },
                ],
                match: {
                  name: ".*.pdf$",
                },
              },
            ],
          },
        ],
        match: {
          query: "from:example2@example.com",
        },
      },
      {
        actions: [
          {
            name: "thread.moveToArchive",
          },
        ],
        messages: [
          {
            attachments: [
              {
                actions: [
                  {
                    args: {
                      conflictStrategy: "keep",
                      description:
                        "Mail title: {{message.subject}}\nMail date: {{message.date}}\nMail link: https://mail.google.com/mail/u/0/#inbox/{{message.id}}",
                      location:
                        "/Examples/example3ab/file-{{message.date|formatDate('yyyy-MM-dd')}}-{{message.subject}}.txt",
                    },
                    name: "attachment.store",
                  },
                ],
              },
            ],
          },
        ],
        match: {
          query: "(from:example3a@example.com OR from:example3b@example.com)",
        },
      },
      {
        actions: [
          {
            args: {
              location: "/PDF Emails/{{thread.firstMessageSubject}}.pdf",
            },
            name: "thread.storePDF",
          },
        ],
        messages: [
          {
            attachments: [
              {
                actions: [
                  {
                    args: {
                      conflictStrategy: "keep",
                      description:
                        "Mail title: {{message.subject}}\nMail date: {{message.date}}\nMail link: https://mail.google.com/mail/u/0/#inbox/{{message.id}}",
                      location: "/PDF Emails/{{attachment.name}}",
                    },
                    name: "attachment.store",
                  },
                ],
              },
            ],
          },
        ],
        match: {
          query: "label:PDF",
        },
      },
      {
        messages: [
          {
            attachments: [
              {
                actions: [
                  {
                    args: {
                      conflictStrategy: "keep",
                      description:
                        "Mail title: {{message.subject}}\nMail date: {{message.date}}\nMail link: https://mail.google.com/mail/u/0/#inbox/{{message.id}}",
                      location:
                        "/Examples/example4/file-{{message.date|formatDate('yyyy-MM-dd')}}-{{message.subject}}.txt",
                    },
                    name: "attachment.store",
                  },
                ],
                match: {
                  name: "file\\.txt",
                },
              },
            ],
          },
        ],
        match: {
          query: "from:example4@example.com",
        },
      },
    ],
  }
  it("should convert a v1 config JSON to v2 config", () => {
    const v1config = ConfigMocks.newDefaultV1ConfigJson()
    const actual = convertV1Config(v1config)
    expect(actual).toMatchObject(expectedConfig)
  })
  it("should get essential v2 config from v1 config", () => {
    const exampleMinConfigV1 = {
      processedLabel: "gmail2gdrive/client-test",
      sleepTime: 100,
      maxRuntime: 280,
      newerThan: "2m",
      timezone: "GMT",
      rules: [
        {
          filter: "to:my.name+scans@gmail.com",
          folder: "'Scans'-yyyy-MM-dd",
        },
      ],
    }
    const essentialConfig = convertV1Config(exampleMinConfigV1)
    console.log(JSON.stringify(essentialConfig, null, 2))
  })
})
