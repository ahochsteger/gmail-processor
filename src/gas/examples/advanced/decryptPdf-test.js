// NOTE: Do not edit this auto-generated file!
// Template: src/templates/gas-test.eta
// Source: src/examples/advanced/decryptPdf.ts

function decryptPdfTestConfig() {
  /**
   * This is an example to demonstrate how to decrypt and store a PDF file.
   * To keep passwords secure, it uses a script property variable.
   * You must manually create a script property named `PDF_PASSWORD` with the
   * actual password in the Google Apps Script project settings.
   */
  const info = {
    name: "decryptPdf",
    title: "Decrypt and Store PDF",
    description:
      "The action custom.decryptAndStorePdf decrypts and stores a PDF file. NOTE Make sure to set the PDF_PASSWORD script property in the Google Apps Script project settings.",
    category: "advanced",
    issues: [355],
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
      variables: [
        {
          key: "pdfPassword",
          type: "property",
          value: "PDF_PASSWORD",
        },
      ],
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
                name: "attachment.storeDecryptedPdf",
                args: {
                  location: `${GmailProcessorLib.E2EDefaults.DRIVE_TESTS_BASE_PATH}/advanced/{{message.date|formatDate('yyyy-MM-dd')}}/decrypted.pdf`,
                  conflictStrategy: GmailProcessorLib.ConflictStrategy.REPLACE,
                  password: "${variables.pdfPassword}",
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
          message: "One thread should have been processed",
          assertFn: (_testConfig, procResult) =>
            procResult.processedThreads === 1,
        },
        {
          message: "One message should have been processed",
          assertFn: (_testConfig, procResult) =>
            procResult.processedMessages === 1,
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
    GmailProcessorLib.EnvProvider.defaultContext(
      GmailProcessorLib.RunMode.DANGEROUS,
      {
        cacheService: CacheService,
        propertiesService: PropertiesService,
      },
    ),
  )
}
