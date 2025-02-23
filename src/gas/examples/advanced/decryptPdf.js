function decryptPdfRun() {
  const config = {
    description:
      "The action `custom.decryptAndStorePdf` decrypts and stores a PDF file.",
    settings: {
      markProcessedMethod: "mark-read",
    },
    global: {
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
                name: "custom.decryptAndStorePdf",
                args: {
                  location:
                    "/GmailProcessor-Tests/e2e/advanced/{{message.date|formatDate('yyyy-MM-dd')}}/decrypted.pdf",
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

  const customActions = [
    {
      name: "decryptAndStorePdf",
      action: async (ctx, args) => {
        const location = args.location // evaluate(ctx, args.location)
        try {
          ctx.log.info(`decryptAndStorePdf(): location=${location}`)
          const attachment = ctx.attachment.object
          const base64Content = ctx.env.utilities.base64Encode(
            attachment.getBytes(),
          )
          ctx.log.info(`decryptAndStorePdf(): Loading PDF document ...`)
          const pdfDoc = await pdf_lib_1.PDFDocument.load(base64Content, {
            password: args.password,
            ignoreEncryption: true,
          })
          ctx.log.info(`decryptAndStorePdf(): Decrypt PDF content ...`)
          const decryptedContent = await pdfDoc.save()
          ctx.log.info(`decryptAndStorePdf(): Create new PDF blob ...`)
          const decryptedPdf = ctx.env.utilities.newBlob(
            decryptedContent,
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
      },
    },
  ]
  return GmailProcessorLib.run(config, "dry-run", customActions)
}
