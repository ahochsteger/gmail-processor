import { ConflictStrategy } from "../../lib/adapter/GDriveAdapter"
import { Config } from "../../lib/config/Config"
import { MarkProcessedMethod } from "../../lib/config/SettingsConfig"
import { E2EInitConfig, E2ETest, E2ETestConfig } from "../../lib/e2e/E2E"
import { E2EDefaults } from "../../lib/e2e/E2EDefaults"
import { Example, ExampleCategory, ExampleInfo } from "../Example"

export const info: ExampleInfo = {
  name: "conflictStrategy",
  title: "Conflict Strategy",
  description: "Test different conflict strategies like increment.",
  category: ExampleCategory.FEATURES,
}

export const initConfig: E2EInitConfig = {
  mails: [
    {
      attachments: ["sample.docx", "sample.txt"],
    },
  ],
}

export const runConfig: Config = {
  description: info.description,
  settings: {
    logSheetLocation:
      "/GmailProcessor-Tests/logsheet-{{date.now|formatDate('yyyy-MM')}}",
    markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
  },
  global: {
    thread: {
      match: {
        query: `has:attachment -in:trash -in:drafts -in:spam after:{{date.now|formatDate('yyyy-MM-dd')}} is:unread subject:"${E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}"`,
        maxMessageCount: -1,
        minMessageCount: 1,
      },
    },
  },
  threads: [
    {
      match: {
        query:
          "from:{{user.email}} to:{{user.email}} subject:'Test with office attachments'",
      },
      attachments: [
        {
          description: "Process *.docx attachment files",
          match: {
            name: "(?<basename>.+)\\.docx$",
          },
          actions: [
            {
              description: "Store original docx file",
              name: "attachment.store",
              args: {
                conflictStrategy: ConflictStrategy.REPLACE,
                location: `${E2EDefaults.DRIVE_TESTS_BASE_PATH}/{{attachment.name}}`,
              },
            },
            {
              description: "Store docx file with increment strategy",
              name: "attachment.store",
              args: {
                conflictStrategy: ConflictStrategy.INCREMENT,
                incrementPrefix: "_",
                incrementSuffix: "",
                incrementStart: 2,
                location: `${E2EDefaults.DRIVE_TESTS_BASE_PATH}/{{attachment.name}}`,
              },
            },
          ],
        },
      ],
    },
  ],
}

export const example: Example = {
  info,
  config: runConfig,
}

export const tests: E2ETest[] = [
  {
    message: "Successful execution",
    assertions: [
      {
        message: "One thread config should have been processed",
        assertFn: (_testConfig, procResult) =>
          procResult.processedThreadConfigs === 1,
      },
      {
        message: "One thread should have been processed",
        assertFn: (_testConfig, procResult) =>
          procResult.processedThreads === 1,
      },
      {
        message: "One message should have been processed",
        assertFn: (_testConfig, procResult) =>
          procResult.processedMessages === 1,
      },
      {
        message: "One attachment config should have been processed",
        assertFn: (_testConfig, procResult) =>
          procResult.processedAttachmentConfigs === 1,
      },
      {
        message: "One attachment should have been processed",
        assertFn: (_testConfig, procResult) =>
          procResult.processedAttachments === 1,
      },
      {
        message: "Correct number of actions should have been executed",
        assertFn: (_testConfig, procResult) =>
          procResult.executedActions.length === 3,
      },
    ],
  },
]

export const testConfig: E2ETestConfig = {
  example,
  info,
  initConfig,
  runConfig,
  tests,
}
