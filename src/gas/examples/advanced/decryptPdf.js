function decryptPdfRun() {
  const config = {
    description:
      "The action custom.decryptAndStorePdf decrypts and stores a PDF file. NOTE Make sure to set the PDF_PASSWORD script property in the Google Apps Script project settings.",
    settings: {
      markProcessedMethod: "mark-read",
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
          query:
            "has:attachment -in:trash -in:drafts -in:spam after:{{date.now|formatDate('yyyy-MM-dd')}} is:unread subject:\"[GmailProcessor-Test] decryptPdf\"",
        },
      },
    },
    threads: [
      {
        match: {
          query: "subject:([GmailProcessor-Test] decryptPdf)",
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
                  location:
                    "/GmailProcessor-Tests/e2e/advanced/{{message.date|formatDate('yyyy-MM-dd')}}/decrypted.pdf",
                  conflictStrategy: "replace",
                  password: "${variables.pdfPassword}",
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
