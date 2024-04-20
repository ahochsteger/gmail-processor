// NOTE: Do not edit this auto-generated file!
// Template: src/examples/_templates/test-e2e.tmpl
// Source: src/examples/actions/actionExport.ts

function actionExportTest() {
  const info = {
    name: "actionExport",
    title: "Export Thread/Message",
    description: "This is a simple example to start with Gmail Processor.",
    category: "actions",
    generate: ["docs", "test-e2e"], // TODO: Fix missing mock data for folder and enable test-spec again!
    pullRequests: [291],
    schemaVersion: "v2",
  }

  const initConfig = {
    mails: [
      {
        attachments: [`invoice.pdf`],
      },
    ],
  }

  const runConfig = {
    description: info.description,
    settings: {
      logSheetLocation:
        "/GmailProcessor-Tests/logsheet-${date.now:date::yyyy-MM}",
      markProcessedMethod:
        GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
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
              location:
                "/GmailProcessor-Tests/pr-291/thread-${thread.id}-${thread.firstMessageSubject}.html",
              conflictStrategy: GmailProcessorLib.ConflictStrategy.REPLACE,
            },
          },
          {
            name: "thread.exportAsPdf",
            args: {
              location:
                "/GmailProcessor-Tests/pr-291/thread-${thread.id}-${thread.firstMessageSubject}.pdf",
              conflictStrategy: GmailProcessorLib.ConflictStrategy.REPLACE,
            },
          },
        ],
      },
      message: {
        actions: [
          {
            name: "message.exportAsHtml",
            args: {
              location:
                "/GmailProcessor-Tests/pr-291/message-${message.id}-${message.subject}.html",
              conflictStrategy: GmailProcessorLib.ConflictStrategy.REPLACE,
            },
          },
          {
            name: "message.exportAsPdf",
            args: {
              location:
                "/GmailProcessor-Tests/pr-291/message-${message.id}-${message.subject}.pdf",
              conflictStrategy: GmailProcessorLib.ConflictStrategy.REPLACE,
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

  const actionExportExample = {
    info,
    config: runConfig,
  }

  const tests = []

  const testConfig = {
    info,
    initConfig,
    runConfig,
    tests,
  }
  GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.RunMode.DANGEROUS,
  )
}
