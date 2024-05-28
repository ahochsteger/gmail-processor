// NOTE: Do not edit this auto-generated file!
// Template: src/templates/gas-test.eta
// Source: src/examples/actions/actionExport.ts

function actionExportTest() {
  /**
   * This example demonstrates how to export messages or threads to HTML or PDF documents.
   *
   * * `message.exportAsHtml`: Exports a message to an HTML document.
   * * `message.exportAsPdf`: Exports a message to a PDF document.
   * * `thread.exportAsHtml`: Exports a thread to an HTML document.
   * * `thread.exportAsPdf`: Exports a thread to a PDF document.
   */
  const info = {
    name: "actionExport",
    title: "Export Thread/Message",
    description: "Export a thread or message as HTML or PDF.",
    category: "actions",
    skipGenerate: ["test-spec"],
    pullRequests: [291],
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
          query: `-in:trash -in:drafts -in:spam after:\${date.now:date::yyyy-MM-dd} subject:'${GmailProcessorLib.E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}'`,
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

  const example = {
    info,
    config: runConfig,
  }

  const tests = []

  const testConfig = {
    example,
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
