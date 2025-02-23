import { PDFDocument } from "@cantoo/pdf-lib"
import { AttachmentContext, ProcessingStatus } from "../../lib/Context"
import {
  ActionFunction,
  ActionReturnType,
} from "../../lib/actions/ActionRegistry"
import { StoreActionBaseArgs } from "../../lib/config/ActionConfig"
import { Config } from "../../lib/config/Config"
import { MarkProcessedMethod } from "../../lib/config/SettingsConfig"
import { E2EInitConfig, E2ETest, E2ETestConfig } from "../../lib/e2e/E2E"
import {
  Example,
  ExampleCategory,
  ExampleInfo,
  ExampleVariant,
} from "../Example"
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
  variant: ExampleVariant.CUSTOM_ACTIONS,
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
              name: "custom.decryptAndStorePdf",
              args: {
                location: `${E2EDefaults.DRIVE_TESTS_BASE_PATH}/advanced/{{message.date|formatDate('yyyy-MM-dd')}}/decrypted.pdf`,
                conflictStrategy: "replace",
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
  customActions: [
    {
      name: "decryptAndStorePdf",
      action: (async (
        ctx: AttachmentContext,
        args: StoreActionBaseArgs & { password: string },
      ): Promise<ActionReturnType> => {
        const location = args.location // evaluate(ctx, args.location)
        try {
          ctx.log.info(`decryptAndStorePdf(): location=${location}`)
          const attachment = ctx.attachment.object
          const base64Content = ctx.env.utilities.base64Encode(
            attachment.getBytes(),
          )
          ctx.log.info(`decryptAndStorePdf(): Loading PDF document ...`)
          const pdfDoc = await PDFDocument.load(base64Content, {
            password: args.password,
            ignoreEncryption: true,
          })
          ctx.log.info(`decryptAndStorePdf(): Decrypt PDF content ...`)
          const decryptedContent: Uint8Array = await pdfDoc.save()
          ctx.log.info(`decryptAndStorePdf(): Create new PDF blob ...`)
          const decryptedPdf = ctx.env.utilities.newBlob(
            decryptedContent as any as GoogleAppsScript.Byte[],
            attachment.getContentType(),
            attachment.getName(),
          )
          ctx.log.info(
            `decryptAndStorePdf(): Store PDF file to '${location}' ...`,
          )
          return ctx.proc.gdriveAdapter.createFileFromAction(
            ctx,
            args.location,
            decryptedPdf,
            args.conflictStrategy,
            args.description,
            "decrypted PDF",
            "custom",
            "custom.decryptAndStorePdf",
          )
        } catch (e) {
          ctx.log.error(
            // `Error while saving decrypted pdf to ${evaluate(ctx, args.location)}: ${e}`,
            `Error while saving decrypted pdf to ${location}: ${e}`,
          )
          throw e
        }
      }) as any as ActionFunction,
    },
  ],
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
