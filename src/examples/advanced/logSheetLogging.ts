import { ProcessingStatus } from "../../lib/Context"
import { Config } from "../../lib/config/Config"
import { MarkProcessedMethod } from "../../lib/config/SettingsConfig"
import { E2EInitConfig, E2ETest, E2ETestConfig } from "../../lib/e2e/E2E"
import { LogLevel } from "../../lib/utils/Logger"
import { Example, ExampleInfo } from "../Example"
import { ConflictStrategy } from "./../../lib/adapter/GDriveAdapter"
import { ProcessingStage } from "./../../lib/config/ActionConfig"
import { E2EDefaults } from "./../../lib/e2e/E2EDefaults"

export const info: ExampleInfo = {
  name: "logSheetLogging",
  title: "LogSheet Logging",
  description: "Demonstrates logging to a Google Spreadsheet.",
  category: "advanced",
  generate: ["docs", "test-e2e"],
  schemaVersion: "v2",
}

export const initConfig: E2EInitConfig = {
  mails: [
    {
      attachments: ["invoice.pdf", "sample.docx"],
    },
  ],
}

export const runConfig: Config = {
  description: info.description,
  settings: {
    markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
    logSheetLocation:
      "/GmailProcessor-Tests/logsheet-${date.now:date::yyyy-MM}",

    richLogFields: [
      "log.timestamp",
      "context.type",
      "gmailUrl",
      "date",
      "subject",
      "from",
      "gdriveLocation",
      "gdriveUrl",
      "gdriveDownloadUrl",
      "log.message",
    ],
  },
  threads: [
    // Place thread processing config here
    {
      match: {
        query: `from:\${user.email} subject:'${E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}'`,
      },
      actions: [
        {
          name: "global.sheetLog",
          args: {
            level: LogLevel.INFO,
            message: "Thread log (pre-main): ${thread.id}",
          },
          processingStage: ProcessingStage.PRE_MAIN,
        },
        {
          name: "global.sheetLog",
          args: {
            level: LogLevel.INFO,
            message: "Thread log (main): ${thread.id}",
          },
          processingStage: ProcessingStage.MAIN,
        },
        {
          name: "global.sheetLog",
          args: {
            level: LogLevel.INFO,
            message: "Thread log (post-main): ${thread.id}",
          },
          processingStage: ProcessingStage.POST_MAIN,
        },
      ],
      messages: [
        {
          actions: [
            {
              name: "global.sheetLog",
              args: {
                level: LogLevel.WARN,
                message: "Message log (pre-main): ${message.id}",
              },
              processingStage: ProcessingStage.PRE_MAIN,
            },
            {
              name: "global.sheetLog",
              args: {
                level: LogLevel.WARN,
                message: "Message log (main): ${message.id}",
              },
              processingStage: ProcessingStage.MAIN,
            },
            {
              name: "global.sheetLog",
              args: {
                level: LogLevel.WARN,
                message: "Message log (post-main): ${message.id}",
              },
              processingStage: ProcessingStage.POST_MAIN,
            },
          ],
          attachments: [
            {
              actions: [
                {
                  name: "global.sheetLog",
                  args: {
                    level: LogLevel.ERROR,
                    message: "Attachment log (pre-main): ${attachment.hash}",
                  },
                  processingStage: ProcessingStage.PRE_MAIN,
                },
                {
                  name: "attachment.store",
                  args: {
                    conflictStrategy: ConflictStrategy.UPDATE,
                    location: `${E2EDefaults.DRIVE_TESTS_BASE_PATH}/${info.name}/\${attachment.name}`,
                  },
                },
                {
                  name: "global.sheetLog",
                  args: {
                    level: LogLevel.ERROR,
                    message: "Attachment log (post-main): ${attachment.hash}",
                  },
                  processingStage: ProcessingStage.POST_MAIN,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export const logSheetLoggingExample: Example = {
  info,
  config: runConfig,
}

export const tests: E2ETest[] = [
  {
    message: "No failures",
    assertions: [
      {
        message: "Processing status should be OK",
        assertFn: (_testConfig, procResult) =>
          procResult.status === ProcessingStatus.OK,
      },
      {
        message: "At least one thread should have been processed",
        assertFn: (_testConfig, procResult) => procResult.processedThreads >= 1,
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

export const testConfig: E2ETestConfig = {
  info,
  initConfig,
  runConfig,
  tests,
}
