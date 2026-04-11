import { ConflictStrategy } from "../../lib/adapter/GDriveAdapter"
import { Config } from "../../lib/config/Config"
import { MarkProcessedMethod } from "../../lib/config/SettingsConfig"
import { E2EInitConfig, E2ETest, E2ETestConfig } from "../../lib/e2e/E2E"
import { E2EDefaults } from "../../lib/e2e/E2EDefaults"
import { Example, ExampleCategory, ExampleInfo } from "../Example"

/**
 * This example shows how to convert MS Office attachments into Google formats.
 *
 * Use the argument `toMimeType` of the action `attachment.store` to convert the document into one of the supported formats.
 */
export const info: ExampleInfo = {
  name: "convertToGoogle",
  title: "Convert to Google",
  description: "Convert MS Office attachments into Google formats.",
  category: ExampleCategory.FEATURES,
  pullRequests: [197],
}

export const initConfig: E2EInitConfig = {
  mails: [
    {
      attachments: ["sample.docx", "sample.pptx", "sample.xlsx"],
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
        query: "from:{{user.email}} to:{{user.email}}",
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
                location: `${E2EDefaults.driveTestBasePath(info)}/{{attachment.name}}`,
              },
            },
            {
              description: "Store docx file converted to Google Docs format",
              name: "attachment.store",
              args: {
                conflictStrategy: ConflictStrategy.REPLACE,
                location: `${E2EDefaults.driveTestBasePath(info)}/{{attachment.name.match.basename}}-from-docx`,
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
                location: `${E2EDefaults.driveTestBasePath(info)}/{{attachment.name}}`,
              },
            },
            {
              description:
                "Store pptx file converted to Google Presentations format",
              name: "attachment.store",
              args: {
                conflictStrategy: ConflictStrategy.REPLACE,
                location: `${E2EDefaults.driveTestBasePath(info)}/{{attachment.name.match.basename}}-from-pptx`,
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
                location: `${E2EDefaults.driveTestBasePath(info)}/{{attachment.name}}`,
              },
            },
            {
              description:
                "Store xlsx file converted to Google Spreadsheet format",
              name: "attachment.store",
              args: {
                conflictStrategy: ConflictStrategy.REPLACE,
                location: `${E2EDefaults.driveTestBasePath(info)}/{{attachment.name.match.basename}}-from-xlsx`,
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
    message: "Execution should be successful",
    assertions: [
      {
        message: "Should have converted DOCX to Google Docs",
        assertFn: (_testConfig, _procResult, _ctx, _expect, h) => {
          const a = h.findAction("attachment.store", {
            "arg.toMimeType": "application/vnd.google-apps.document",
          })
          return (
            h.expectStatus() &&
            h.expectActionExecuted(a, "DOCX conversion") &&
            h.expectActionMeta(a, "attachment.stored.location", /.*\/sample-from-docx$/)
          )
        },
      },
      {
        message: "Should have converted XLSX to Google Spreadsheet",
        assertFn: (_testConfig, _procResult, _ctx, _expect, h) => {
          const a = h.findAction("attachment.store", {
            "arg.toMimeType": "application/vnd.google-apps.spreadsheet",
          })
          return (
            h.expectStatus() &&
            h.expectActionExecuted(a, "XLSX conversion") &&
            h.expectActionMeta(a, "attachment.stored.location", /.*\/sample-from-xlsx$/)
          )
        },
      },
      {
        message: "Should have converted PPTX to Google Presentation",
        assertFn: (_testConfig, _procResult, _ctx, _expect, h) => {
          const a = h.findAction("attachment.store", {
            "arg.toMimeType": "application/vnd.google-apps.presentation",
          })
          return (
            h.expectStatus() &&
            h.expectActionExecuted(a, "PPTX conversion") &&
            h.expectActionMeta(a, "attachment.stored.location", /.*\/sample-from-pptx$/)
          )
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
