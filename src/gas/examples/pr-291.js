/**
 * This is a special configuration used for end-to-end testing using the emails generated by `e2eInit.js`.
 * @type {GmailProcessorLib.Config}
 */
const pr291Config = {
  description: "End-to-end (E2E) test configuration",
  settings: {
    logSheetLocation:
      "/GmailProcessor-Tests/logsheet-${date.now:format:yyyy-MM}",
    markProcessedMethod: "mark-read",
    timezone: "UTC",
  },
  global: {
    thread: {
      match: {
        query: "-in:trash -in:drafts -in:spam after:2024-02-06",
        maxMessageCount: -1,
        minMessageCount: 1,
      },
      actions: [
        {
          name: "thread.exportAsHtml",
          args: {
            location: "/GmailProcessor-Tests/pr-291/thread-${thread.id}.html",
            conflictStrategy: "replace",
          },
        },
        {
          name: "thread.exportAsPdf",
          args: {
            location: "/GmailProcessor-Tests/pr-291/thread-${thread.id}.pdf",
            conflictStrategy: "replace",
          },
        },
      ],
    },
    message: {
      actions: [
        {
          name: "message.exportAsHtml",
          args: {
            location: "/GmailProcessor-Tests/pr-291/message-${message.id}.html",
            conflictStrategy: "replace",
          },
        },
        {
          name: "message.exportAsPdf",
          args: {
            location: "/GmailProcessor-Tests/pr-291/message-${message.id}.pdf",
            conflictStrategy: "replace",
          },
        },
      ],
    },
  },
  threads: [
    {
      match: {
        query:
          "from:${user.email} to:${user.email} subject:'GmailProcessor-Test'",
      },
    },
  ],
}

/**
 * Run Gmail Processor with config
 * @param {GoogleAppsScript.Events.TimeDriven | undefined} evt Event information
 * @param {EnvContext | undefined} ctx Environment context
 * @returns {GmailProcessorLib.ProcessingResult} Processing result
 */
function pr291Run(_evt, ctx) {
  return GmailProcessorLib.run(
    pr291Config,
    GmailProcessorLib.RunMode.DANGEROUS,
    ctx,
  )
}
