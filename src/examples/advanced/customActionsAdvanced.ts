import { ConflictStrategy } from "../../lib/adapter/GDriveAdapter"
import { Config } from "../../lib/config/Config"
import { MarkProcessedMethod } from "../../lib/config/SettingsConfig"
import { ProcessingStatus } from "../../lib/Context"
import { E2EInitConfig, E2ETest, E2ETestConfig } from "../../lib/e2e/E2E"
import {
  Example,
  ExampleCategory,
  ExampleInfo,
  ExampleVariant,
} from "../Example"
import { E2EDefaults } from "./../../lib/e2e/E2EDefaults"

/**
 * This example demonstrates how to use `actionMeta` in custom actions to pass data to subsequent actions.
 *
 * In this scenario, a custom action `custom.parseInvoice` extracts an invoice number from the email body
 * and stores it in `actionMeta`. This value is then accessible in the `attachment.store` action
 * using the placeholder `{{message.invoiceNumber}}`.
 */
export const info: ExampleInfo = {
  name: "customActionsAdvanced",
  title: "Advanced Custom Actions",
  description:
    "Demonstrates how to use actionMeta to pass data between actions.",
  category: ExampleCategory.ADVANCED,
  variant: ExampleVariant.CUSTOM_ACTIONS,
  issues: [540],
}

export const initConfig: E2EInitConfig = {
  mails: [
    {
      body: "Invoice Number: INV-12345",
      attachments: [`invoice.pdf`],
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
        query: "from:{{user.email}}",
      },
      messages: [
        {
          actions: [
            {
              name: "custom.parseInvoice",
            },
          ],
          attachments: [
            {
              match: {
                name: "^invoice\\.pdf$",
              },
              actions: [
                {
                  name: "attachment.store",
                  args: {
                    // Use the value extracted by the custom action:
                    location: `${E2EDefaults.driveTestBasePath(info)}/{{message.invoiceNumber}}/{{attachment.name}}`,
                    conflictStrategy: ConflictStrategy.KEEP,
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
  customActions: [
    {
      name: "parseInvoice",
      action: (ctx, _args) => {
        // Ensure we have a message context (runtime check that also satisfies TS)
        if (!("message" in ctx)) return {}
        // @ts-ignore
        const body = ctx.message.object.getBody()
        const match = body.match(/Invoice Number: (INV-\d+)/)
        if (match && match[1]) {
          ctx.log.info(`Extracted invoice number: ${match[1]}`)
          // Store the extracted value in actionMeta to make it available as {{message.invoiceNumber}}
          return {
            "message.invoiceNumber": match[1],
          }
        }
        return {}
      },
    },
  ],
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
        message: "One message should have been processed",
        assertFn: (_testConfig, procResult) =>
          procResult.processedMessages === 1,
      },
      {
        message: "Custom action should have been executed",
        assertFn: (_testConfig, procResult) =>
          procResult.executedActions.some(
            (action) => action.config.name === "custom.parseInvoice",
          ),
      },
      {
        message: "Invoice number should have been extracted",
        assertFn: (_testConfig, procResult) =>
          procResult.executedActions.some(
            (action) =>
              action.config.name === "custom.parseInvoice" &&
              action.result &&
              action.result["message.invoiceNumber"] === "INV-12345",
          ),
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
