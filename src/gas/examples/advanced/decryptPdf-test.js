// NOTE: Do not edit this auto-generated file!
// Template: src/templates/gas-test.eta
// Source: src/examples/advanced/decryptPdf.ts

function decryptPdfTestConfig() {
  /**
   * This is an example to demonstrate custom actions.
   */
  const info = {
    name: "decryptPdf",
    title: "Decrypt and Store PDF",
    description:
      "The action `custom.decryptAndStorePdf` decrypts and stores a PDF file.",
    category: "advanced",
    variant: "custom-actions",
    pullRequests: [381],
  }

  const initConfig = {
    mails: [
      {
        attachments: [`encrypted.pdf`],
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
          query: `subject:(${GmailProcessorLib.E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name})`,
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
                  location: `${GmailProcessorLib.E2EDefaults.DRIVE_TESTS_BASE_PATH}/advanced/{{message.date|formatDate('yyyy-MM-dd')}}/decrypted.pdf`,
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

  const example = {
    info,
    config: runConfig,
    customActions: [
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
            const pdfDoc = await GmailProcessorLib.PDFDocument.load(
              base64Content,
              {
                password: args.password,
                ignoreEncryption: true,
              },
            )
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
    ],
  }

  const tests = [
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
          assertFn: (_testConfig, procResult) =>
            procResult.processedThreads >= 1,
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
            procResult.status !== GmailProcessorLib.ProcessingStatus.ERROR,
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

  const testConfig = {
    example,
    info,
    initConfig,
    runConfig,
    tests,
  }
  return testConfig
}

function decryptPdfTest() {
  const testConfig = decryptPdfTestConfig()
  return GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.RunMode.DANGEROUS,
  )
}
