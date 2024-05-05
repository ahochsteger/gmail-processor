// NOTE: Do not edit this auto-generated file!
// Template: src/examples/_templates/test-e2e.tmpl
// Source: src/examples/actions/actionAttachmentExtractText.ts

function actionAttachmentExtractTextTest() {
  /**
   * This example demonstrates the use of the action `attachment.extractText` to extract matching text from the content of an attachment for use in later actions (e.g. use as part of the filename for `attachment.store`).
   */
  const info = {
    name: "actionAttachmentExtractText",
    title: "attachment.extractText",
    description:
      "This example demonstrates the use of the action `attachment.extractText` to extract text from attachments.",
    category: "actions",
    generate: ["docs", "test-e2e", "test-spec"],
    pullRequests: [319],
    schemaVersion: "v2",
  }

  const initConfig = {
    mails: [
      {
        attachments: [`invoice.pdf`],
      },
    ],
  }

  const runConfig = {
    description: info.description,
    global: {
      thread: {
        match: {
          query: `has:attachment -in:trash -in:drafts -in:spam from:\${user.email} to:\${user.email} after:\${date.now:date::yyyy-MM-dd} subject:'${GmailProcessorLib.E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}'`,
        },
      },
    },
    settings: {
      markProcessedMethod:
        GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
    },
    threads: [
      {
        match: {
          query: `subject:([GmailProcessor-Test] ${info.name})`,
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
                  docsFileLocation: `${GmailProcessorLib.E2EDefaults.DRIVE_TESTS_BASE_PATH}/${info.name}/\${attachment.name.match.basename} (Google Docs)`,
                  extract:
                    "Invoice date:\\s*(?<invoiceDate>[A-Za-z]{3} [0-9]{1,2}, [0-9]{4})\\s*Invoice number:\\s*(?<invoiceNumber>[0-9]+)\\s*Payment due:\\s(?<paymentDueDays>[0-9]+)\\sdays after invoice date",
                },
                processingStage: GmailProcessorLib.ProcessingStage.PRE_MAIN,
              },
              {
                description:
                  "Store the attachment using extracted values for `invoiceNumber` and `invoiceDate`",
                name: "attachment.store",
                args: {
                  conflictStrategy: GmailProcessorLib.ConflictStrategy.UPDATE,
                  location: `${GmailProcessorLib.E2EDefaults.DRIVE_TESTS_BASE_PATH}/${info.name}/\${attachment.name.match.basename}-number-\${attachment.extracted.match.invoiceNumber}-date-\${attachment.extracted.match.invoiceDate:date::yyyy-MM-dd}-due-\${attachment.extracted.match.paymentDueDays}-days.pdf`,
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

  const actionAttachmentExtractTextExample = {
    info,
    config: runConfig,
  }

  const tests = [
    {
      message: "Successful execution",
      assertions: [
        {
          message: "One thread config should have been processed",
          assertFn: (_testConfig, procResult) =>
            procResult.processedThreadConfigs == 1,
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
            procResult.processedMessages + procResult.processedAttachments * 2,
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
    {
      message: "Skipped tests",
      assertions: [
        {
          message: "Processing status should not be ERROR",
          assertFn: (_testConfig, procResult) =>
            procResult.status !== GmailProcessorLib.ProcessingStatus.ERROR,
          skip: true,
        },
        {
          message: "No error should have occurred",
          assertFn: (_testConfig, procResult) => procResult.error === undefined,
          skip: true,
        },
        {
          message: "No action should have failed",
          assertFn: (_testConfig, procResult) =>
            procResult.failedAction === undefined,
          skip: true,
        },
      ],
    },
  ]

  const testConfig = {
    info,
    initConfig,
    runConfig,
    tests,
  }
  GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.RunMode.DANGEROUS,
  )
}
