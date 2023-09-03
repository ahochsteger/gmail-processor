/** @type {GmailProcessorLib.Config} */
const e2eTest01Config = {
  description: "End-to-end (E2E) test configuration",
  settings: {
    logSheetLocation:
      "/GmailProcessor-Tests/logsheet-${date.now:format:yyyy-MM}",
    markProcessedMethod:
      GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
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
      messages: [
        {
          attachments: [
            {
              match: { name: "^(?<basename>.+).png$" },
              actions: [
                {
                  name: "global.sheetLog",
                  args: {
                    message:
                      "A sheetLog message for the matched message (pre).",
                    level: "info",
                  },
                  processingStage: GmailProcessorLib.ProcessingStage.PRE_MAIN,
                },
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
            {
              match: { name: "^(?<basename>.+).txt$" },
              actions: [
                {
                  name: "attachment.store",
                  args: {
                    location:
                      "/GmailProcessor-Tests/v2/e2e01/txt/${attachment.name.match.basename}-stored.txt",
                  },
                },
              ],
            },
          ],
          actions: [
            {
              name: "global.sheetLog",
              args: {
                message:
                  "A sheetLog message for the matched message (post-main stage).",
                level: "info",
              },
              processingStage: GmailProcessorLib.ProcessingStage.POST_MAIN,
            },
            {
              name: "global.sheetLog",
              args: {
                message:
                  "A sheetLog message for the matched message (main stage).",
                level: "info",
              },
              processingStage: GmailProcessorLib.ProcessingStage.MAIN,
            },
            {
              name: "global.sheetLog",
              args: {
                message:
                  "A sheetLog message for the matched message (pre-main stage).",
                level: "info",
              },
              processingStage: GmailProcessorLib.ProcessingStage.PRE_MAIN,
            },
          ],
        },
      ],
    },
  ],
}

function e2eTest01Run(
  /** @type {EnvContext | undefined} */
  ctx,
) {
  return GmailProcessorLib.run(
    e2eTest01Config,
    GmailProcessorLib.RunMode.DRY_RUN,
    ctx,
  )
}
