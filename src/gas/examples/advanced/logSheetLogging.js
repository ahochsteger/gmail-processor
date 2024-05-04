// NOTE: Do not edit this auto-generated file!
// Template: src/examples/_templates/test-e2e.tmpl
// Source: src/examples/advanced/logSheetLogging.ts

function logSheetLoggingTest() {
  const info = {
    name: "logSheetLogging",
    title: "LogSheet Logging",
    description: "Demonstrates logging to a Google Spreadsheet.",
    category: "advanced",
    generate: ["docs", "test-e2e"],
    schemaVersion: "v2",
  }

  const initConfig = {
    mails: [
      {
        attachments: ["invoice.pdf", "sample.docx"],
      },
    ],
  }

  const runConfig = {
    description: info.description,
    settings: {
      markProcessedMethod:
        GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
      logSheetLocation:
        "/GmailProcessor-Tests/logsheet-${date.now:date::yyyy-MM}",

      logFields: [
        "log.timestamp",
        "log.level",
        "log.message",
        "object.id",
        "object.date",
        "object.subject",
        "object.from",
        "object.url",
        "attachment.name",
        "attachment.size",
        "attachment.contentType",
        "stored.location",
        "stored.url",
        "stored.downloadUrl",
        "context.type",
      ],
    },
    threads: [
      // Place thread processing config here
      {
        match: {
          query: `from:\${user.email} subject:'${GmailProcessorLib.E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}'`,
        },
        actions: [
          {
            name: "global.sheetLog",
            args: {
              level: GmailProcessorLib.LogLevel.INFO,
              message: "Thread log (pre-main): ${thread.id}",
            },
            processingStage: GmailProcessorLib.ProcessingStage.PRE_MAIN,
          },
          {
            name: "global.sheetLog",
            args: {
              level: GmailProcessorLib.LogLevel.INFO,
              message: "Thread log (main): ${thread.id}",
            },
            processingStage: GmailProcessorLib.ProcessingStage.MAIN,
          },
          {
            name: "global.sheetLog",
            args: {
              level: GmailProcessorLib.LogLevel.INFO,
              message: "Thread log (post-main): ${thread.id}",
            },
            processingStage: GmailProcessorLib.ProcessingStage.POST_MAIN,
          },
        ],
        messages: [
          {
            actions: [
              {
                name: "global.sheetLog",
                args: {
                  level: GmailProcessorLib.LogLevel.WARN,
                  message: "Message log (pre-main): ${message.id}",
                },
                processingStage: GmailProcessorLib.ProcessingStage.PRE_MAIN,
              },
              {
                name: "global.sheetLog",
                args: {
                  level: GmailProcessorLib.LogLevel.WARN,
                  message: "Message log (main): ${message.id}",
                },
                processingStage: GmailProcessorLib.ProcessingStage.MAIN,
              },
              {
                name: "global.sheetLog",
                args: {
                  level: GmailProcessorLib.LogLevel.WARN,
                  message: "Message log (post-main): ${message.id}",
                },
                processingStage: GmailProcessorLib.ProcessingStage.POST_MAIN,
              },
            ],
            attachments: [
              {
                actions: [
                  {
                    name: "global.sheetLog",
                    args: {
                      level: GmailProcessorLib.LogLevel.ERROR,
                      message: "Attachment log (pre-main): ${attachment.hash}",
                    },
                    processingStage: GmailProcessorLib.ProcessingStage.PRE_MAIN,
                  },
                  {
                    name: "attachment.store",
                    args: {
                      conflictStrategy:
                        GmailProcessorLib.ConflictStrategy.UPDATE,
                      location: `${GmailProcessorLib.E2EDefaults.DRIVE_TESTS_BASE_PATH}/${info.name}/\${attachment.name}`,
                    },
                  },
                  {
                    name: "global.sheetLog",
                    args: {
                      level: GmailProcessorLib.LogLevel.ERROR,
                      message: "Attachment log (post-main): ${attachment.hash}",
                    },
                    processingStage:
                      GmailProcessorLib.ProcessingStage.POST_MAIN,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }

  const logSheetLoggingExample = {
    info,
    config: runConfig,
  }

  const tests = [
    {
      message: "No failures",
      assertions: [
        {
          message: "Processing status should be OK",
          assertFn: (_testConfig, procResult) =>
            procResult.status === GmailProcessorLib.ProcessingStatus.OK,
        },
        {
          message: "At least one thread should have been processed",
          assertFn: (_testConfig, procResult) =>
            procResult.processedThreads >= 1,
        },
        {
          message: "Expected number of actions should have been executed",
          assertFn: (_testConfig, procResult) =>
            procResult.executedActions.length ===
            procResult.processedThreads * 2 +
              procResult.processedMessages * 3 +
              procResult.processedAttachments * 3,
        },
      ],
    },
  ]

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
