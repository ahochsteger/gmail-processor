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
        body: "Invoice Number: INV-12345",
        attachments: [`invoice.pdf`],
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
                      location: `${GmailProcessorLib.E2EDefaults.driveTestBasePath(info)}/{{message.invoiceNumber}}/{{attachment.name}}`,
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

  const tests = [
    {
      message: "No failures",
      assertions: [
        {
          message: "Processing status should be OK",
          assertFn: (_testConfig, procResult) =>
            procResult.status === GmailProcessorLib.ProcessingStatus.OK,
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

  const testConfig = {
    example,
    info,
    initConfig,
    runConfig,
    tests,
  }
  return testConfig
}

function customActionsAdvancedTest() {
  const testConfig = customActionsAdvancedTestConfig()
  return GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.RunMode.DANGEROUS,
    GmailProcessorLib.EnvProvider.defaultContext(
      GmailProcessorLib.RunMode.DANGEROUS,
      {
        cacheService: CacheService,
        propertiesService: PropertiesService,
      },
    ),
  )
}
