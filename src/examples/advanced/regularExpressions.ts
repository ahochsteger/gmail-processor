import { ProcessingStatus } from "../../lib/Context"
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
 * This example demonstrates how to use regular expressions in the configuration.
 *
 * It does to following with the message subject:
 * * Ignores a common subject prefix
 * * Captures the school name using the capture group `(?<school>...)`
 * * Captures the report type using the capture group `(?<reportType>...)`
 * * Captures the report sub type using the capture group `(?<reportSubType>...)`
 * * Capture the date as the final part of the subject using the capture group `(?<date>...)`
 *
 * The extracted data is finally used to dynamically define the location of the attachment to be stored using:
 * `.../Reports/${message.subject.match.school}/All Reports/${message.subject.match.reportType}/${message.subject.match.reportSubType}/${message.subject.match.date}-${attachment.name}`
 */
export const info: ExampleInfo = {
  name: "regularExpressions",
  title: "Regular Expressions",
  description:
    "Regular expressions allow to define patterns and extract values to simplify the configuration.",
  category: ExampleCategory.ADVANCED,
  skipGenerate: [ExampleTemplateType.TEST_SPEC],
}

export const initConfig: E2EInitConfig = {
  mails: [
    {
      subject: `${info.name} School A-Internal-Reading-\${date.now:date::yyyy-MM-dd}`,
      attachments: ["sample.docx"],
    },
  ],
}

export const runConfig: Config = {
  description: info.description,
  settings: {
    markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
  },
  global: {
    thread: {
      match: {
        query: `has:attachment -in:trash -in:drafts -in:spam after:\${date.now:date::yyyy-MM-dd} is:unread subject:"${E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}"`,
      },
    },
  },
  threads: [
    {
      match: {
        query: "from:${user.email}",
      },
      messages: [
        {
          name: "extract-message-fields-from-subject",
          match: {
            subject: `${info.name} (?<school>[^-]+)-(?<reportType>[^-]+)-(?<reportSubType>[^-]+)-(?<date>[0-9-]+)`,
          },
          attachments: [
            {
              match: {
                name: "^sample\\.docx$",
              },
              actions: [
                {
                  name: "attachment.store",
                  args: {
                    location: `${E2EDefaults.DRIVE_TESTS_BASE_PATH}/${info.name}/Reports/\${message.subject.match.school}/All Reports/\${message.subject.match.reportType}/\${message.subject.match.reportSubType}/\${message.subject.match.date}-\${attachment.name}`,
                    conflictStrategy: ConflictStrategy.UPDATE,
                  },
                },
              ],
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
        message: "At least one thread should have been processed",
        assertFn: (_testConfig, procResult) => procResult.processedThreads >= 1,
      },
      {
        message: "Expected number of actions should have been executed",
        assertFn: (_testConfig, procResult) =>
          procResult.executedActions.length ===
          procResult.processedThreads + procResult.processedAttachments,
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
