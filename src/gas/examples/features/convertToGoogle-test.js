// NOTE: Do not edit this auto-generated file!
// Template: src/templates/gas-test.eta
// Source: src/examples/features/convertToGoogle.ts

function convertToGoogleTestConfig() {
  /**
   * This example shows how to convert MS Office attachments into Google formats.
   *
   * Use the argument `toMimeType` of the action `attachment.store` to convert the document into one of the supported formats.
   */
  const info = {
    name: "convertToGoogle",
    title: "Convert to Google",
    description: "Convert MS Office attachments into Google formats.",
    category: "features",
    pullRequests: [197],
  }

  const initConfig = {
    mails: [
      {
        attachments: ["sample.docx", "sample.pptx", "sample.xlsx"],
      },
    ],
  }

  const runConfig = {
    description: info.description,
    settings: {
      logSheetLocation:
        "/GmailProcessor-Tests/logsheet-{{date.now|formatDate('yyyy-MM')}}",
      markProcessedMethod:
        GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
    },
    global: {
      thread: {
        match: {
          query: `has:attachment -in:trash -in:drafts -in:spam after:{{date.now|formatDate('yyyy-MM-dd')}} is:unread subject:"${GmailProcessorLib.E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}"`,
          maxMessageCount: -1,
          minMessageCount: 1,
        },
      },
    },
    threads: [
      {
        match: {
          query:
            "from:{{user.email}} to:{{user.email}} subject:'Test with office attachments'",
        },
        attachments: [
          {
            description: "Process *.docx attachment files",
            match: {
              name: "(?<basename>.+)\\.docx$",
            },
            actions: [
              {
                description: "Store original docx file",
                name: "attachment.store",
                args: {
                  conflictStrategy: GmailProcessorLib.ConflictStrategy.REPLACE,
                  location: `${GmailProcessorLib.E2EDefaults.DRIVE_TESTS_BASE_PATH}/{{attachment.name}}`,
                },
              },
              {
                description: "Store docx file converted to Google Docs format",
                name: "attachment.store",
                args: {
                  conflictStrategy: GmailProcessorLib.ConflictStrategy.REPLACE,
                  location: `${GmailProcessorLib.E2EDefaults.DRIVE_TESTS_BASE_PATH}/{{attachment.name.match.basename}}`,
                  toMimeType: "application/vnd.google-apps.document",
                },
              },
            ],
          },
          {
            description: "Process *.pptx attachment files",
            match: {
              name: "(?<basename>.+)\\.pptx$",
            },
            actions: [
              {
                description: "Store original pptx file",
                name: "attachment.store",
                args: {
                  conflictStrategy: GmailProcessorLib.ConflictStrategy.REPLACE,
                  location: `${GmailProcessorLib.E2EDefaults.DRIVE_TESTS_BASE_PATH}/{{attachment.name}}`,
                },
              },
              {
                description:
                  "Store pptx file converted to Google Presentations format",
                name: "attachment.store",
                args: {
                  conflictStrategy: GmailProcessorLib.ConflictStrategy.REPLACE,
                  location: `${GmailProcessorLib.E2EDefaults.DRIVE_TESTS_BASE_PATH}/{{attachment.name.match.basename}}`,
                  toMimeType: "application/vnd.google-apps.presentation",
                },
              },
            ],
          },
          {
            description: "Process *.xlsx attachment files",
            match: {
              name: "(?<basename>.+)\\.xlsx$",
            },
            actions: [
              {
                description: "Store original xlsx file",
                name: "attachment.store",
                args: {
                  conflictStrategy: GmailProcessorLib.ConflictStrategy.REPLACE,
                  location: `${GmailProcessorLib.E2EDefaults.DRIVE_TESTS_BASE_PATH}/{{attachment.name}}`,
                },
              },
              {
                description:
                  "Store xlsx file converted to Google Spreadsheet format",
                name: "attachment.store",
                args: {
                  conflictStrategy: GmailProcessorLib.ConflictStrategy.REPLACE,
                  location: `${GmailProcessorLib.E2EDefaults.DRIVE_TESTS_BASE_PATH}/{{attachment.name.match.basename}}`,
                  toMimeType: "application/vnd.google-apps.spreadsheet",
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

  const tests = []

  const testConfig = {
    example,
    info,
    initConfig,
    runConfig,
    tests,
  }
  return testConfig
}

function convertToGoogleTest() {
  const testConfig = convertToGoogleTestConfig()
  return GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.RunMode.DANGEROUS,
  )
}
