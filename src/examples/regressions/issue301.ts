import { ConflictStrategy } from "../../lib/adapter/GDriveAdapter"
import { Config } from "../../lib/config/Config"
import { MarkProcessedMethod } from "../../lib/config/SettingsConfig"
import { E2EInitConfig, E2ETest, E2ETestConfig } from "../../lib/e2e/E2E"
import { E2EDefaults } from "../../lib/e2e/E2EDefaults"
import { Example, ExampleInfo } from "../Example"

/**
 * This example is a test for PR #301 to fix `getBlob` error on conflict strategy `update`.
 */
export const info: ExampleInfo = {
  name: "issue301",
  title: "Issue #301",
  description:
    "This example is a test for PR #301 to fix `getBlob` error on conflict strategy `update`.",
  category: "regressions",
  generate: ["test-e2e", "test-spec"],
  issues: [300],
  pullRequests: [301],
  schemaVersion: "v2",
}

export const initConfig: E2EInitConfig = {
  mails: [
    {
      subject: "Test for PR #301",
      body: "Test email for PR #301.",
      attachments: ["sample.xlsx"],
    },
  ],
}

export const runConfig: Config = {
  description: info.description,
  settings: {
    logSheetLocation:
      "/GmailProcessor-Tests/logsheet-${date.now:date::yyyy-MM}",
    markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
    timezone: "UTC",
  },
  global: {
    thread: {
      match: {
        query:
          "has:attachment -in:trash -in:drafts -in:spam after:${date.now:date::yyyy-MM-dd}",
        maxMessageCount: -1,
        minMessageCount: 1,
      },
    },
  },
  threads: [
    {
      match: {
        query:
          "from:${user.email} to:${user.email} subject:'Test with office attachments'",
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
                location: `${E2EDefaults.DRIVE_TESTS_BASE_PATH}/\${attachment.name}`,
              },
            },
            {
              description: "Store docx file converted to Google Docs format",
              name: "attachment.store",
              args: {
                conflictStrategy: ConflictStrategy.REPLACE,
                location: `${E2EDefaults.DRIVE_TESTS_BASE_PATH}/\${attachment.name.match.basename}`,
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
                location: `${E2EDefaults.DRIVE_TESTS_BASE_PATH}/\${attachment.name}`,
              },
            },
            {
              description:
                "Store pptx file converted to Google Presentations format",
              name: "attachment.store",
              args: {
                conflictStrategy: ConflictStrategy.REPLACE,
                location: `${E2EDefaults.DRIVE_TESTS_BASE_PATH}/\${attachment.name.match.basename}`,
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
                location: `${E2EDefaults.DRIVE_TESTS_BASE_PATH}/\${attachment.name}`,
              },
            },
            {
              description:
                "Store xlsx file converted to Google Spreadsheet format",
              name: "attachment.store",
              args: {
                conflictStrategy: ConflictStrategy.REPLACE,
                location: `${E2EDefaults.DRIVE_TESTS_BASE_PATH}/\${attachment.name.match.basename}`,
                toMimeType: "application/vnd.google-apps.spreadsheet",
              },
            },
          ],
        },
      ],
    },
  ],
}

export const issue301Example: Example = {
  info,
  config: runConfig,
}

export const tests: E2ETest[] = []

export const testConfig: E2ETestConfig = {
  info,
  initConfig,
  runConfig,
  tests,
}
