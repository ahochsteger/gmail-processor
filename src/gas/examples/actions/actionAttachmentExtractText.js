function actionAttachmentExtractTextRun() {
  const config = {
    description:
      "The action `attachment.extractText` extracts text from attachments.",
    global: {
      thread: {
        match: {
          query:
            'has:attachment -in:trash -in:drafts -in:spam from:${user.email} to:${user.email} after:${date.now:date::yyyy-MM-dd} is:unread subject:"[GmailProcessor-Test] actionAttachmentExtractText"',
        },
      },
    },
    settings: {
      markProcessedMethod: "mark-read",
    },
    threads: [
      {
        match: {
          query: "subject:([GmailProcessor-Test] actionAttachmentExtractText)",
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
                  docsFileLocation:
                    "/GmailProcessor-Tests/e2e/actionAttachmentExtractText/${attachment.name.match.basename} (Google Docs)",
                  extract:
                    "Invoice date:\\s*(?<invoiceDate>[A-Za-z]{3} [0-9]{1,2}, [0-9]{4})\\s*Invoice number:\\s*(?<invoiceNumber>[0-9]+)\\s*Payment due:\\s(?<paymentDueDays>[0-9]+)\\sdays after invoice date",
                },
                processingStage: "pre-main",
              },
              {
                description:
                  "Store the attachment using extracted values for `invoiceNumber` and `invoiceDate`",
                name: "attachment.store",
                args: {
                  conflictStrategy: "update",
                  location:
                    "/GmailProcessor-Tests/e2e/actionAttachmentExtractText/${attachment.name.match.basename}-number-${attachment.extracted.match.invoiceNumber}-date-${attachment.extracted.match.invoiceDate:date::yyyy-MM-dd}-due-${attachment.extracted.match.paymentDueDays}-days.pdf",
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

  return GmailProcessorLib.run(config, "dry-run")
}
