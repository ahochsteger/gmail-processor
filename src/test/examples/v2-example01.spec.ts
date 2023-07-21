import { PartialDeep } from "type-fest"
import { RunMode } from "../../lib/Context"
import { Config, ProcessingConfig } from "../../lib/config/Config"
import { GMail2GDrive } from "../mocks/Examples"
import { MockFactory, Mocks } from "../mocks/MockFactory"

const example01ConfigV2: PartialDeep<Config> = {
  description: "An example V2 configuration",
  settings: {
    maxBatchSize: 10,
    maxRuntime: 280,
    sleepTimeThreads: 100,
    sleepTimeMessages: 0,
    sleepTimeAttachments: 0,
    timezone: "UTC",
  },
  global: {
    thread: {
      match: {
        query: "has:attachment -in:trash -in:drafts -in:spam newer_than:1d",
        maxMessageCount: -1,
        minMessageCount: 1,
      },
      actions: [],
    },
  },
  threads: [
    {
      description:
        "Store all attachments sent to my.name+scans@gmail.com to the folder 'Scans'",
      match: {
        query: "to:my.name+scans@gmail.com",
      },
      actions: [
        {
          name: "thread.storePDF",
          args: {
            folder: "Scans-${message.date:dateformat:yyyy-MM-dd}",
          },
        },
      ],
    },
  ],
}

let mocks: Mocks
beforeEach(() => {
  mocks = MockFactory.newMocks(
    GMail2GDrive.Lib.getEffectiveConfig(example01ConfigV2),
    RunMode.DANGEROUS,
  )
})

it("should provide the effective config of v2 example example01", () => {
  const effectiveConfig = GMail2GDrive.Lib.getEffectiveConfig(example01ConfigV2)
  expect(effectiveConfig).toBeInstanceOf(ProcessingConfig)
})

it("should process a v2 config example", () => {
  const result = GMail2GDrive.Lib.run(
    example01ConfigV2,
    "dry-run",
    mocks.envContext,
  )
  expect(result.status).toEqual("ok")
})
