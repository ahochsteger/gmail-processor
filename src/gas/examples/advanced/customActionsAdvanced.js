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
                        "/GmailProcessor-Tests/e2e/customActionsAdvanced/{{message.invoiceNumber}}/{{attachment.name}}",
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
  ]
  return GmailProcessorLib.run(config, "dry-run", customActions)
}
