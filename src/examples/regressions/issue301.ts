import { ConflictStrategy } from "../../lib/adapter/GDriveAdapter"
import { Config } from "../../lib/config/Config"
import { ProcessingStatus } from "../../lib/Context"
import { MarkProcessedMethod } from "../../lib/config/SettingsConfig"
import { E2EInitConfig, E2ETest, E2ETestConfig } from "../../lib/e2e/E2E"
import { E2EDefaults } from "../../lib/e2e/E2EDefaults"
import {
  Example,
  ExampleCategory,
  ExampleInfo,
  ExampleTemplateType,
} from "../Example"

/**
 * This example is a test for PR #301 to fix `getBlob` error on conflict strategy `update`.
 */
export const info: ExampleInfo = {
  name: "issue301",
  title: "getBlob Issue",
  description: "Tests a fix for `getBlob` error on conflict strategy `update`.",
  category: ExampleCategory.REGRESSIONS,
  skipGenerate: [ExampleTemplateType.TEST_SPEC],
  issues: [300],
  pullRequests: [301],
}

export const initConfig: E2EInitConfig = {
  mails: [
    {
      body: "Test email for PR #301.",
      attachments: ["sample.xlsx"],
    },
  ],
}

export const runConfig: Config = {
  description: info.description,
  settings: {
    logSheetLocation:
      "/GmailProcessor-Tests/logsheet-{{date.now|formatDate('yyyy-MM')}}",
    markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
    timezone: "Etc/UTC",
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
          `from:{{user.email}} to:{{user.email}} subject:(${E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name})`,
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
              description: "Store docx file converted to Google Docs format",
              name: "attachment.store",
              args: {
                conflictStrategy: ConflictStrategy.REPLACE,
                location: `${E2EDefaults.DRIVE_TESTS_BASE_PATH}/{{attachment.name.match.basename}}`,
                toMimeType: "application/vnd.google-apps.document",
              },
            },
          ],
        },
        {
          description: "Process *.pptx attachment files",
          match: {
            name: "(?<basename>.+)\\.pptx$",
          },
          actions: [
            {
              description: "Store original pptx file",
              name: "attachment.store",
              args: {
                conflictStrategy: ConflictStrategy.REPLACE,
                location: `${E2EDefaults.DRIVE_TESTS_BASE_PATH}/{{attachment.name}}`,
              },
            },
            {
              description:
                "Store pptx file converted to Google Presentations format",
              name: "attachment.store",
              args: {
                conflictStrategy: ConflictStrategy.REPLACE,
                location: `${E2EDefaults.DRIVE_TESTS_BASE_PATH}/{{attachment.name.match.basename}}`,
                toMimeType: "application/vnd.google-apps.presentation",
              },
            },
          ],
        },
        {
          description: "Process *.xlsx attachment files",
          match: {
            name: "(?<basename>.+)\\.xlsx$",
          },
          actions: [
            {
              description: "Store original xlsx file",
              name: "attachment.store",
              args: {
                conflictStrategy: ConflictStrategy.REPLACE,
                location: `${E2EDefaults.DRIVE_TESTS_BASE_PATH}/{{attachment.name}}`,
              },
            },
            {
              description:
                "Store xlsx file converted to Google Spreadsheet format",
              name: "attachment.store",
              args: {
                conflictStrategy: ConflictStrategy.REPLACE,
                location: `${E2EDefaults.DRIVE_TESTS_BASE_PATH}/{{attachment.name.match.basename}}`,
                toMimeType: "application/vnd.google-apps.spreadsheet",
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
    message: "No failures",
    assertions: [
      {
        message: "Processing status should be OK",
        assertFn: (_testConfig, procResult) =>
          procResult.status === ProcessingStatus.OK,
      },
      {
        message: "One thread should have been processed",
        assertFn: (_testConfig, procResult) =>
          procResult.processedThreads === 1,
      },
      {
        message: "One attachment should have been processed",
        assertFn: (_testConfig, procResult) =>
          procResult.processedAttachments === 1,
      },
      {
        message: "Expected number of actions should have been executed",
        assertFn: (_testConfig, procResult) =>
          procResult.executedActions.length ===
          procResult.processedThreads + procResult.processedAttachments * 2, // 2 actions per attachment (store original, store converted)
      },
      {
        message: "Actions should have been executed",
        assertFn: (_testConfig, procResult) => {
          const storeActions = procResult.executedActions.filter(
            (a) => a.config.name === "attachment.store",
          )
          return storeActions.length === 2
        },
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
