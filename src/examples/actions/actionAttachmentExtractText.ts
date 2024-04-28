import { E2EDefaults } from "../../../src/lib/e2e/E2EDefaults"
import { E2EInitConfig, E2ETest, E2ETestConfig } from "../../lib/e2e/E2E"
import { Example, ExampleInfo } from "../Example"
import { ProcessingStatus } from "./../../lib/Context"
import { ConflictStrategy } from "./../../lib/adapter/GDriveAdapter"
import { ProcessingStage } from "./../../lib/config/ActionConfig"
import { Config } from "./../../lib/config/Config"
import { MarkProcessedMethod } from "./../../lib/config/SettingsConfig"

export const info: ExampleInfo = {
  name: "actionAttachmentExtractText",
  title: "attachment.extractText",
  description:
    "This example demonstrates the use of the action `attachment.extractText` to extract matching text from the content of an attachment for use in later actions (e.g. use as part of the filename for `attachment.store`).",
  category: "actions",
  generate: ["docs", "test-e2e", "test-spec"],
  pullRequests: [319],
  schemaVersion: "v2",
}

export const initConfig: E2EInitConfig = {
  mails: [
    {
      attachments: [`invoice.pdf`],
    },
  ],
}

export const runConfig: Config = {
  description: info.description,
  global: {
    thread: {
      match: {
        query: `has:attachment -in:trash -in:drafts -in:spam from:\${user.email} to:\${user.email} after:\${date.now:date::yyyy-MM-dd} subject:'${E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}'`,
      },
    },
  },
  settings: {
    markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
  },
  threads: [
    {
      match: {
        query: `subject:([GmailProcessor-Test] ${info.name})`,
      },
      attachments: [
        {
          description: "Process all attachments named 'invoice*.pdf'",
          match: {
            name: "(?<basename>invoice.*)\\.pdf$",
          },
          actions: [
            {
              description:
                "Extract the text from the body of the PDF attachment using language auto-detection.",
              name: "attachment.extractText",
              args: {
                docsFileLocation: `${E2EDefaults.DRIVE_TESTS_BASE_PATH}/${info.name}/\${attachment.name.match.basename} (Google Docs)`,
                extract:
                  "Invoice date:\\s*(?<invoiceDate>[A-Za-z]{3} [0-9]{1,2}, [0-9]{4})\\s*Invoice number:\\s*(?<invoiceNumber>[0-9]+)\\s*Payment due:\\s(?<paymentDueDays>[0-9]+)\\sdays after invoice date",
              },
              processingStage: ProcessingStage.PRE_MAIN,
            },
            {
              description:
                "Store the attachment using extracted values for `invoiceNumber` and `invoiceDate`",
              name: "attachment.store",
              args: {
                conflictStrategy: ConflictStrategy.UPDATE,
                location: `${E2EDefaults.DRIVE_TESTS_BASE_PATH}/${info.name}/\${attachment.name.match.basename}-number-\${attachment.extracted.match.invoiceNumber}-date-\${attachment.extracted.match.invoiceDate:date::yyyy-MM-dd}-due-\${attachment.extracted.match.paymentDueDays}-days.pdf`,
                description:
                  "Invoice number: ${attachment.extracted.match.invoiceNumber}\nInvoice date: ${attachment.extracted.match.invoiceDate:date::yyyy-MM-dd}\nPayment due: ${attachment.extracted.match.paymentDueDays} days",
              },
            },
          ],
        },
      ],
    },
  ],
}

export const actionAttachmentExtractTextExample: Example = {
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
          procResult.processedThreadConfigs == 1,
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
          procResult.processedMessages + procResult.processedAttachments * 2,
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
  {
    message: "Skipped tests",
    assertions: [
      {
        message: "Processing status should not be ERROR",
        assertFn: (_testConfig, procResult) =>
          procResult.status !== ProcessingStatus.ERROR,
        skip: true,
      },
      {
        message: "No error should have occurred",
        assertFn: (_testConfig, procResult) => procResult.error === undefined,
        skip: true,
      },
      {
        message: "No action should have failed",
        assertFn: (_testConfig, procResult) =>
          procResult.failedAction === undefined,
        skip: true,
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
