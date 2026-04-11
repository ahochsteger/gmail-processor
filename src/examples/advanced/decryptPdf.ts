import { ConflictStrategy } from "../../lib/adapter/GDriveAdapter"
import { Config } from "../../lib/config/Config"
import { MarkProcessedMethod } from "../../lib/config/SettingsConfig"
import { E2EInitConfig, E2ETest, E2ETestConfig } from "../../lib/e2e/E2E"
import { Example, ExampleCategory, ExampleInfo } from "../Example"
import { E2EDefaults } from "./../../lib/e2e/E2EDefaults"

/**
 * This is an example to demonstrate how to decrypt and store a PDF file.
 * To keep passwords secure, it uses a script property variable.
 * You must manually create a script property named `PDF_PASSWORD` with the
 * actual password in the Google Apps Script project settings.
 */
export const info: ExampleInfo = {
  name: "decryptPdf",
  title: "Decrypt and Store PDF",
  description:
    "The action custom.decryptAndStorePdf decrypts and stores a PDF file. NOTE Make sure to set the PDF_PASSWORD script property in the Google Apps Script project settings.",
  category: ExampleCategory.ADVANCED,
  issues: [355],
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
    variables: [
      {
        key: "pdfPassword",
        type: "property",
        value: "PDF_PASSWORD",
      },
    ],
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
                location: `${E2EDefaults.driveTestBasePath(info)}/decrypted.pdf`,
                conflictStrategy: ConflictStrategy.REPLACE,
                password: "${variables.pdfPassword}",
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
        message: "Attachment should have been decrypted and stored",
        assertFn: (_testConfig, _procResult, _ctx, _expect, h) => {
          const a = h.findAction("attachment.storeDecryptedPdf", {
            "arg.password": "${variables.pdfPassword}",
          })
          return (
            h.expectStatus() &&
            h.expectActionExecuted(a, "attachment.storeDecryptedPdf") &&
            h.expect(
              _ctx,
              Reflect.get(a?.config.args ?? {}, "password"),
              "${variables.pdfPassword}",
              "password",
            ) &&
            h.expectActionMeta(a, "meta.attachment.stored.location", /.*\/decrypted\.pdf$/)
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
