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
                  location: `${GmailProcessorLib.E2EDefaults.driveTestBasePath(info)}/decrypted.pdf`,
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
      message: "Execution should be successful",
      assertions: [
        {
          message: "Attachment should have been decrypted and stored",
          assertFn: (_testConfig, _procResult, _ctx, _expect, h) => {
            const a = h.findAction("attachment.storeDecryptedPdf", {
              "arg.password": "${variables.pdfPassword}",
            })
            return (
              h.expectStatus() &&
              h.expectActionExecuted(a, "attachment.storeDecryptedPdf") &&
              h.expect(
                _ctx,
                Reflect.get(a?.config.args ?? {}, "password"),
                "${variables.pdfPassword}",
                "password",
              ) &&
              h.expectActionMeta(
                a,
                "meta.attachment.stored.location",
                /.*\/decrypted\.pdf$/,
              )
            )
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

async function decryptPdfTest() {
  const testConfig = decryptPdfTestConfig()
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
