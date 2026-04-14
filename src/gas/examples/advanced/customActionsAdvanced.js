/** @generated - DO NOT EDIT MANUALLY - Use 'npm run update:examples' instead */
function customActionsAdvancedRun() {
  const config = {
    description:
      "Demonstrates how to use actionMeta to pass data between actions.",
    settings: {
      markProcessedMethod: "mark-read",
    },
    global: {
      thread: {
        match: {
          query:
            "has:attachment -in:trash -in:drafts -in:spam after:{{date.now|formatDate('yyyy-MM-dd')}} is:unread subject:\"[GmailProcessor-Test] customActionsAdvanced\"",
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
                processingStage: "pre-main",
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
                      location:
                        "/GmailProcessor-Tests/e2e/{{date.now|formatDate('yyyy-MM-dd')}}/advanced/customActionsAdvanced/{{custom.invoiceNumber}}/{{attachment.name}}",
                      conflictStrategy: "keep",
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

  const customActions = [
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
  ]
  return GmailProcessorLib.run(config, "dry-run", customActions, undefined, {
    cacheService: CacheService,
    propertiesService: PropertiesService,
  })
}
