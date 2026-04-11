// NOTE: Do not edit this auto-generated file!
// Template: src/templates/gas-test.eta
// Source: src/examples/advanced/customActionsAdvanced.ts

function customActionsAdvancedTestConfig() {
  /**
   * This example demonstrates how to use `actionMeta` in custom actions to pass data to subsequent actions.
   *
   * In this scenario, a custom action `custom.parseInvoice` extracts an invoice number from the email body
   * and stores it in `actionMeta`. This value is then accessible in the `attachment.store` action
   * using the placeholder `{{message.invoiceNumber}}`.
   */
  const info = {
    name: "customActionsAdvanced",
    title: "Advanced Custom Actions",
    description:
      "Demonstrates how to use actionMeta to pass data between actions.",
    category: "advanced",
    variant: "custom-actions",
    issues: [540],
  }

  const initConfig = {
    mails: [
      {
        body: "Invoice Number: INV-161126",
        attachments: ["invoice.pdf"],
      },
    ],
  }

  const runConfig = {
    description: info.description,
    settings: {
      markProcessedMethod:
        GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
    },
    global: {
      thread: {
        match: {
          query: `has:attachment -in:trash -in:drafts -in:spam after:{{date.now|formatDate('yyyy-MM-dd')}} is:unread subject:"${GmailProcessorLib.E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}"`,
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
                processingStage: GmailProcessorLib.ProcessingStage.PRE_MAIN,
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
                      location: `${GmailProcessorLib.E2EDefaults.driveTestBasePath(info)}/{{custom.invoiceNumber}}/{{attachment.name}}`,
                      conflictStrategy: GmailProcessorLib.ConflictStrategy.KEEP,
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

  const example = {
    info,
    config: runConfig,
    customActions: [
      {
        name: "parseInvoice",
        action: (ctx, _args) => {
          // Ensure we have a message context (runtime check that also satisfies TS)
          if (!("message" in ctx)) return {}
          // @ts-ignore
          const body = ctx.message.object.getPlainBody()
          const match = body.match(/Invoice Number:\s*(INV-[0-9]+)/i)
          if (match && match[1]) {
            ctx.log.info(`Extracted invoice number: ${match[1]}`)
            // Store the extracted value in actionMeta to make it available as {{custom.invoiceNumber}}
            return {
              actionMeta: {
                "custom.invoiceNumber": {
                  type: "string", // Corresponds to MetaInfoType.STRING
                  value: match[1],
                  title: "Invoice Number",
                  description: "The extracted invoice number.",
                },
              },
            }
          }
          return {}
        },
      },
    ],
  }

  const tests = [
    {
      message: "Execution should be successful",
      assertions: [
        {
          message: "Invoice number should have been correctly extracted",
          assertFn: (_testConfig, _procResult, _ctx, _expect, h) => {
            const a = h.findAction("custom.parseInvoice")
            return (
              h.expectStatus() &&
              h.expectActionExecuted(a, "custom.parseInvoice") &&
              h.expectActionMeta(a, "custom.invoiceNumber", "INV-161126")
            )
          },
        },
        {
          message:
            "Attachment should have been stored using the extracted invoice number",
          assertFn: (_testConfig, _procResult, _ctx, _expect, h) => {
            const a = h.findAction("attachment.store", {
              "meta.attachment.stored.location": /\/INV-161126\/invoice.pdf$/,
            })
            return h.expectActionExecuted(a, "attachment.store")
          },
        },
      ],
    },
  ]

  const testConfig = {
    example,
    info,
    initConfig,
    runConfig,
    tests,
  }
  return testConfig
}

async function customActionsAdvancedTest() {
  const testConfig = customActionsAdvancedTestConfig()
  return await GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.EnvProvider.defaultContext({
      runMode: GmailProcessorLib.RunMode.DANGEROUS,
      cacheService: CacheService,
      propertiesService: PropertiesService,
    }),
  )
}
