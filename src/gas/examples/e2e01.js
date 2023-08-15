/* global GmailProcessor */

var e2e01ConfigV2 = {
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

function e2e01EffectiveConfig() {
  const effectiveConfig = GmailProcessor.Lib.getEffectiveConfig(e2e01ConfigV2)
  console.log(JSON.stringify(effectiveConfig, null, 2))
}

function e2e01Run() {
  GmailProcessor.Lib.run(e2e01ConfigV2, "dry-run")
}
