import { E2EDefaults } from "../../../src/lib/e2e/E2EDefaults"
import { E2EInitConfig, E2ETest, E2ETestConfig } from "../../lib/e2e/E2E"
import { Example, ExampleCategory, ExampleInfo } from "../Example"
import { ConflictStrategy } from "./../../lib/adapter/GDriveAdapter"
import { ProcessingStage } from "./../../lib/config/ActionConfig"
import { Config } from "./../../lib/config/Config"
import { MarkProcessedMethod } from "./../../lib/config/SettingsConfig"

/**
 * This example demonstrates the use of the action `attachment.extractText` to extract matching text from the content of an attachment for use in later actions (e.g. use as part of the filename for `attachment.store`).
 */
export const info: ExampleInfo = {
  name: "actionAttachmentExtractText",
  title: "Extract Attachment Text",
  description:
    "The action `attachment.extractText` extracts text from attachments.",
  category: ExampleCategory.ACTIONS,
  pullRequests: [319],
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
        query: `has:attachment -in:trash -in:drafts -in:spam from:{{user.email}} to:{{user.email}} after:{{date.now|formatDate('yyyy-MM-dd')}} is:unread subject:"${E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}"`,
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
                docsFileLocation: `${E2EDefaults.driveTestBasePath(info)}/{{attachment.name.match.basename}} (Google Docs)`,
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
                location: `${E2EDefaults.driveTestBasePath(info)}/{{attachment.name.match.basename}}-number-{{attachment.extracted.match.invoiceNumber}}-date-{{attachment.extracted.match.invoiceDate|formatDate('yyyy-MM-dd')}}-due-{{attachment.extracted.match.paymentDueDays}}-days.pdf`,
                description:
                  "Invoice number: {{attachment.extracted.match.invoiceNumber}}\nInvoice date: {{attachment.extracted.match.invoiceDate|formatDate('yyyy-MM-dd')}}\nPayment due: {{attachment.extracted.match.paymentDueDays}} days",
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
        message: "Invoice data should have been correctly extracted",
        assertFn: (_testConfig, _procResult, _ctx, _expect, h) => {
          const a = h.findAction("attachment.extractText", {
            "arg.extract":
              "Invoice date:\\s*(?<invoiceDate>[A-Za-z]{3} [0-9]{1,2}, [0-9]{4})\\s*Invoice number:\\s*(?<invoiceNumber>[0-9]+)\\s*Payment due:\\s(?<paymentDueDays>[0-9]+)\\sdays after invoice date",
          })
          return (
            h.expectStatus() &&
            h.expectActionExecuted(a, "attachment.extractText") &&
            h.expectActionMeta(
              a,
              "meta.attachment.extracted.match.invoiceNumber",
              "161126",
            ) &&
            h.expectActionMeta(
              a,
              "meta.attachment.extracted.match.invoiceDate",
              "Nov 26, 2016",
            ) &&
            h.expectActionMeta(
              a,
              "meta.attachment.extracted.match.paymentDueDays",
              "30",
            )
          )
        },
      },
      {
        message: "Attachment should have been stored at the correct path",
        assertFn: (_testConfig, _procResult, _ctx, _expect, h) => {
          const a = h.findAction("attachment.store", {
            "arg.conflictStrategy": ConflictStrategy.UPDATE,
          })
          return (
            h.expectActionExecuted(a, "attachment.store") &&
            h.expectActionMeta(
              a,
              "meta.attachment.stored.location",
              /.*\/invoice-number-161126-date-2016-11-26-due-30-days\.pdf$/,
            )
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
