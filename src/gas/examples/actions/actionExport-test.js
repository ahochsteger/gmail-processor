/** @generated - DO NOT EDIT MANUALLY - Use 'npm run update:examples' instead */
// NOTE: Do not edit this auto-generated file!
// Template: src/templates/gas-test.eta
// Source: src/examples/actions/actionExport.ts

function actionExportTestConfig() {
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
        attachments: [`image.png`],
        body: `Inline data uri image: <img width="16" height="16" alt="tick" src="data:image/gif;base64,R0lGODdhEAAQAMwAAPj7+FmhUYjNfGuxYYDJdYTIeanOpT+DOTuANXibGOrWj6CONzv2sPjv2CmV1unU4zPgISg6DJnJ3ImTh8Mtbs00aNP1CZSGy0YqLEn47RgXW8amasW7XWsmmvX2iuXiwAAAAAEAAQAAAFVyAgjmRpnihqGCkpDQPbGkNUOFk6DZqgHCNGg2T4QAQBoIiRSAwBE4VA4FACKgkB5NGReASFZEmxsQ0whPDi9BiACYQAInXhwOUtgCUQoORFCGt/g4QAIQA7">`,
      },
    ],
  }

  const runConfig = {
    description: info.description,
    settings: {
      logSheetLocation:
        "/GmailProcessor-Tests/logsheet-{{date.now|formatDate('yyyy-MM')}}",
      markProcessedMethod:
        GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
    },
    global: {
      thread: {
        match: {
          query: `-in:trash -in:drafts -in:spam after:{{date.now|formatDate('yyyy-MM-dd')}} is:unread subject:"${GmailProcessorLib.E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}"`,
          maxMessageCount: -1,
          minMessageCount: 1,
        },
        actions: [
          {
            name: "thread.exportAsHtml",
            args: {
              location: `/GmailProcessor-Tests/${info.category}/${info.name}/thread-{{thread.id}}-{{thread.firstMessageSubject}}.html`,
              conflictStrategy: GmailProcessorLib.ConflictStrategy.REPLACE,
            },
          },
          {
            name: "thread.exportAsPdf",
            args: {
              location:
                "/GmailProcessor-Tests/pr-291/thread-{{thread.id}}-{{thread.firstMessageSubject}}.pdf",
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
              location: `${GmailProcessorLib.E2EDefaults.driveTestBasePath(info)}/message-{{message.id}}-{{message.subject}}.html`,
              conflictStrategy: GmailProcessorLib.ConflictStrategy.REPLACE,
            },
          },
          {
            name: "message.exportAsPdf",
            args: {
              location: `${GmailProcessorLib.E2EDefaults.driveTestBasePath(info)}/message-{{message.id}}-{{message.subject}}.pdf`,
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
            "from:{{user.email}} to:{{user.email}} subject:'GmailProcessor-Test'",
        },
        messages: [{}],
      },
    ],
  }

  const example = {
    info,
    config: runConfig,
  }

  const tests = [
    {
      message: "Execution should be successful",
      assertions: [
        {
          message: "Thread should have been exported as PDF",
          assertFn: (_testConfig, _procResult, _ctx, _expect, h) => {
            const a = h.findAction("thread.exportAsPdf", {
              "arg.conflictStrategy":
                GmailProcessorLib.ConflictStrategy.REPLACE,
            })
            return (
              h.expectStatus() &&
              h.expectActionExecuted(a, "thread.exportAsPdf") &&
              h.expectActionMeta(
                a,
                "thread.stored.location",
                /.*\/thread-.*-.*\.pdf$/,
              )
            )
          },
        },
        {
          message: "Message should have been exported as PDF",
          assertFn: (_testConfig, _procResult, _ctx, _expect, h) => {
            const a = h.findAction("message.exportAsPdf", {
              "arg.conflictStrategy":
                GmailProcessorLib.ConflictStrategy.REPLACE,
            })
            return (
              h.expectActionExecuted(a, "message.exportAsPdf") &&
              h.expectActionMeta(
                a,
                "message.stored.location",
                /.*\/message-.*-.*\.pdf$/,
              )
            )
          },
        },
      ],
    },
  ]

  const testConfig = {
    example,
    info,
    initConfig,
    runConfig,
    tests,
  }
  return testConfig
}

async function actionExportTest() {
  const testConfig = actionExportTestConfig()
  return await GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.EnvProvider.defaultContext({
      runMode: GmailProcessorLib.RunMode.DANGEROUS,
      cacheService: CacheService,
      propertiesService: PropertiesService,
    }),
  )
}
