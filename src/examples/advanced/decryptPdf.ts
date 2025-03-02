import { ConflictStrategy } from "../../lib/adapter/GDriveAdapter"
import { Config } from "../../lib/config/Config"
import { MarkProcessedMethod } from "../../lib/config/SettingsConfig"
import { ProcessingStatus } from "../../lib/Context"
import { E2EInitConfig, E2ETest, E2ETestConfig } from "../../lib/e2e/E2E"
import { Example, ExampleCategory, ExampleInfo } from "../Example"
import { E2EDefaults } from "./../../lib/e2e/E2EDefaults"

/**
 * This is an example to demonstrate custom actions.
 */
export const info: ExampleInfo = {
  name: "decryptPdf",
  title: "Decrypt and Store PDF",
  description:
    "The action `custom.decryptAndStorePdf` decrypts and stores a PDF file.",
  category: ExampleCategory.ADVANCED,
  pullRequests: [381],
}

export const initConfig: E2EInitConfig = {
  mails: [
    {
      attachments: [`encrypted.pdf`],
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
        query: `has:attachment -in:trash -in:drafts -in:spam after:{{date.now|formatDate('yyyy-MM-dd')}} is:unread subject:"${E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}"`,
      },
    },
  },
  threads: [
    {
      match: {
        query: `subject:(${E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name})`,
      },
      attachments: [
        {
          description: "Process all attachments named 'encrypted*.pdf'",
          match: {
            name: "(?<basename>encrypted.*)\\.pdf$",
          },
          actions: [
            {
              name: "attachment.storeDecryptedPdf",
              args: {
                location: `${E2EDefaults.DRIVE_TESTS_BASE_PATH}/advanced/{{message.date|formatDate('yyyy-MM-dd')}}/decrypted.pdf`,
                conflictStrategy: ConflictStrategy.REPLACE,
                password: "test",
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
        message: "At least one thread should have been processed",
        assertFn: (_testConfig, procResult) => procResult.processedThreads >= 1,
      },
      {
        message: "At least one message should have been processed",
        assertFn: (_testConfig, procResult) =>
          procResult.processedMessages >= 1,
      },
      {
        message: "Correct number of actions should have been executed",
        assertFn: (_testConfig, procResult) =>
          procResult.executedActions.length ==
          procResult.processedMessages + procResult.processedAttachments,
      },
    ],
  },
  {
    message: "No failures",
    assertions: [
      {
        message: "Processing status should not be ERROR",
        assertFn: (_testConfig, procResult) =>
          procResult.status !== ProcessingStatus.ERROR,
      },
      {
        message: "No error should have occurred",
        assertFn: (_testConfig, procResult) => procResult.error === undefined,
      },
      {
        message: "No action should have failed",
        assertFn: (_testConfig, procResult) =>
          procResult.failedAction === undefined,
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
