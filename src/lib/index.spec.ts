import { convertV1Config, run } from "."
import { ConfigMocks } from "../test/mocks/ConfigMocks"
import { MockFactory, Mocks } from "../test/mocks/MockFactory"
import { ProcessingStatus, RunMode } from "./Context"
import { Config, newConfig } from "./config/Config"

let configJson: Config
let mocks: Mocks

beforeEach(() => {
  configJson = ConfigMocks.newDefaultConfigJson()
  mocks = MockFactory.newMocks(newConfig(configJson), RunMode.DANGEROUS)
})

describe("run", () => {
  it("test", () => {
    const result = run(configJson, RunMode.DANGEROUS, [], mocks.envContext)
    expect(result).toMatchObject({
      status: ProcessingStatus.OK,
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
                        "Mail title: ${message.subject}\nMail date: ${message.date}\nMail link: https://mail.google.com/mail/u/0/#inbox/${message.id}",
                      location:
                        "/Scans${message.date:date::-yyyy-MM-dd}/${attachment.name}",
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
                        "Mail title: ${message.subject}\nMail date: ${message.date}\nMail link: https://mail.google.com/mail/u/0/#inbox/${message.id}",
                      location: "/Examples/example1/${attachment.name}",
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
                        "Mail title: ${message.subject}\nMail date: ${message.date}\nMail link: https://mail.google.com/mail/u/0/#inbox/${message.id}",
                      location: "/Examples/example2/${attachment.name.match.1}",
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
                        "Mail title: ${message.subject}\nMail date: ${message.date}\nMail link: https://mail.google.com/mail/u/0/#inbox/${message.id}",
                      location:
                        "/Examples/example3ab/file-${message.date:date::yyyy-MM-dd-}${message.subject}.txt",
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
              location: "/PDF Emails/${thread.firstMessageSubject}.pdf",
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
                        "Mail title: ${message.subject}\nMail date: ${message.date}\nMail link: https://mail.google.com/mail/u/0/#inbox/${message.id}",
                      location: "/PDF Emails/${attachment.name}",
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
                        "Mail title: ${message.subject}\nMail date: ${message.date}\nMail link: https://mail.google.com/mail/u/0/#inbox/${message.id}",
                      location:
                        "/Examples/example4/file-${message.date:date::yyyy-MM-dd-}${message.subject}.txt",
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
