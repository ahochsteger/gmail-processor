import { ConflictStrategy } from "../../lib/adapter/GDriveAdapter"
import { Config } from "../../lib/config/Config"
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
 * This example demonstrates how to export messages or threads to HTML or PDF documents.
 *
 * * `message.exportAsHtml`: Exports a message to an HTML document.
 * * `message.exportAsPdf`: Exports a message to a PDF document.
 * * `thread.exportAsHtml`: Exports a thread to an HTML document.
 * * `thread.exportAsPdf`: Exports a thread to a PDF document.
 */
export const info: ExampleInfo = {
  name: "actionExport",
  title: "Export Thread/Message",
  description: "Export a thread or message as HTML or PDF.",
  category: ExampleCategory.ACTIONS,
  skipGenerate: [ExampleTemplateType.TEST_SPEC],
  pullRequests: [291],
}

export const initConfig: E2EInitConfig = {
  mails: [
    {
      attachments: [`image.png`],
      body: `Inline data uri image: <img width="16" height="16" alt="tick" src="data:image/gif;base64,R0lGODdhEAAQAMwAAPj7+FmhUYjNfGuxYYDJdYTIeanOpT+DOTuANXibGOrWj6CONzv2sPjv2CmV1unU4zPgISg6DJnJ3ImTh8Mtbs00aNP1CZSGy0YqLEn47RgXW8amasW7XWsmmvX2iuXiwAAAAAEAAQAAAFVyAgjmRpnihqGCkpDQPbGkNUOFk6DZqgHCNGg2T4QAQBoIiRSAwBE4VA4FACKgkB5NGReASFZEmxsQ0whPDi9BiACYQAInXhwOUtgCUQoORFCGt/g4QAIQA7">`,
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
        query: `-in:trash -in:drafts -in:spam after:{{date.now|formatDate('yyyy-MM-dd')}} is:unread subject:"${E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}"`,
        maxMessageCount: -1,
        minMessageCount: 1,
      },
      actions: [
        {
          name: "thread.exportAsHtml",
          args: {
            location: `/GmailProcessor-Tests/${info.category}/${info.name}/thread-{{thread.id}}-{{thread.firstMessageSubject}}.html`,
            conflictStrategy: ConflictStrategy.REPLACE,
          },
        },
        {
          name: "thread.exportAsPdf",
          args: {
            location:
              "/GmailProcessor-Tests/pr-291/thread-{{thread.id}}-{{thread.firstMessageSubject}}.pdf",
            conflictStrategy: ConflictStrategy.REPLACE,
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
              "/GmailProcessor-Tests/pr-291/message-{{message.id}}-{{message.subject}}.html",
            conflictStrategy: ConflictStrategy.REPLACE,
          },
        },
        {
          name: "message.exportAsPdf",
          args: {
            location:
              "/GmailProcessor-Tests/pr-291/message-{{message.id}}-{{message.subject}}.pdf",
            conflictStrategy: ConflictStrategy.REPLACE,
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
    },
  ],
}

export const example: Example = {
  info,
  config: runConfig,
}

export const tests: E2ETest[] = []

export const testConfig: E2ETestConfig = {
  example,
  info,
  initConfig,
  runConfig,
  tests,
}
