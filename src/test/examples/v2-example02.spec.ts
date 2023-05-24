import { Config } from "../../lib/config/Config"
import { PartialDeep } from "type-fest"
import { ProcessingConfig } from "../../lib/config/Config"
import { GMail2GDrive } from "../mocks/Examples"
import { MockFactory } from "../mocks/MockFactory"

const example02ConfigV2 = {
  description: "An example V2 configuration",
  settings: {
    maxBatchSize: 10,
    maxRuntime: 280,
    processedMode: "read",
    sleepTimeThreads: 100,
    sleepTimeMessages: 0,
    sleepTimeAttachments: 0,
    timezone: "UTC",
  },
  global: {
    match: {
      query: "has:attachment -in:trash -in:drafts -in:spam",
      maxMessageCount: -1,
      minMessageCount: 1,
      newerThan: "1d",
    },
    actions: [],
  },
  messages: [
    {
      description: "Message shorthand config",
      match: {
        subject: "My Subject",
      },
    },
  ],
  attachments: [
    {
      description: "Attachment shorthand config",
      match: {
        name: "my-file-.*",
      },
    },
  ],
  threads: [
    {
      description:
        "Store all attachments sent to my.name+scans@gmail.com to the folder 'Scans'",
      match: {
        query: "to:my.name+scans@gmail.com",
      },
      actions: [
        {
          name: "thread.storeAsPdfToGDrive",
          args: {
            folder: "Scans-${message.date:dateformat:yyyy-MM-dd}",
          },
        },
      ],
    },
  ],
}

it("should provide the effective config of v2 example example02", () => {
  const effectiveConfig = GMail2GDrive.Lib.getEffectiveConfig(
    example02ConfigV2 as PartialDeep<Config>,
  )
  expect(effectiveConfig).toBeInstanceOf(ProcessingConfig)
})

it("should process a v2 config example", () => {
  const result = GMail2GDrive.Lib.run(
    example02ConfigV2 as PartialDeep<Config>,
    "dry-run",
    MockFactory.newEnvContextMock(),
  )
  expect(result.status).toEqual("ok")
})
