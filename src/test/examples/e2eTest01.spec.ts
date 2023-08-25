import { PartialDeep } from "type-fest"
import { RunMode } from "../../lib/Context"
import { Config } from "../../lib/config/Config"
import { GmailProcessorLib } from "../mocks/Examples"
import { MockFactory, Mocks } from "../mocks/MockFactory"

const e2eTest01ConfigV2: PartialDeep<Config> = {
  description: "End-to-end (E2E) test configuration",
  settings: {
    logSheetLocation:
      "/GmailProcessor-Tests/logsheet-${date.now:format:yyyy-MM}",
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
        query: "has:attachment -in:trash -in:drafts -in:spam after:2023-06-19",
        maxMessageCount: -1,
        minMessageCount: 1,
      },
      actions: [],
    },
  },
  threads: [
    {
      actions: [
        {
          name: "global.log",
          args: {
            message: "A log message for the matched thread.",
            level: "info",
          },
        },
        {
          name: "global.sheetLog",
          args: {
            message: "A sheetLog message for the matched thread.",
            level: "info",
          },
        },
      ],
      match: {
        query:
          "from:${user.email} to:${user.email} subject:'GmailProcessor-Test'",
      },
      attachments: [
        {
          match: {
            name: "^(?<basename>.+).png$",
          },
          actions: [
            {
              name: "attachment.store",
              args: {
                location:
                  "/GmailProcessor-Tests/v2/e2e01/${attachment.name.match.basename}-stored.png",
              },
            },
            {
              name: "global.log",
              args: {
                message: "A log message for the matched attachment.",
                level: "info",
              },
            },
            {
              name: "global.sheetLog",
              args: {
                message: "A sheetLog message for the matched attachment.",
                level: "info",
              },
            },
          ],
        },
      ],
    },
  ],
}

let mocks: Mocks
beforeEach(() => {
  mocks = MockFactory.newMocks(e2eTest01ConfigV2, RunMode.DANGEROUS)
})

it("should process a v2 config example", () => {
  const result = GmailProcessorLib.run(
    e2eTest01ConfigV2,
    "dry-run",
    mocks.envContext,
  )
  expect(result.status).toEqual("ok")
})
