// NOTE: Do not edit this auto-generated file!
// Template: src/templates/gas-test.eta
// Source: src/examples/regressions/issue301.ts

function issue301TestConfig() {
  /**
   * This example is a test for PR #301 to fix `getBlob` error on conflict strategy `update`.
   */
  const info = {
    name: "issue301",
    title: "getBlob Issue",
    description:
      "Tests a fix for `getBlob` error on conflict strategy `update`.",
    category: "regressions",
    skipGenerate: ["test-spec"],
    issues: [300],
    pullRequests: [301],
  }

  const initConfig = {
    mails: [
      {
        subject: "Test for PR #301",
        body: "Test email for PR #301.",
        attachments: ["sample.xlsx"],
      },
    ],
  }

  const runConfig = {
    description: info.description,
    settings: {
      logSheetLocation:
        "/GmailProcessor-Tests/logsheet-${date.now:date::yyyy-MM}",
      markProcessedMethod:
        GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
      timezone: "UTC",
    },
    global: {
      thread: {
        match: {
          query:
            "has:attachment -in:trash -in:drafts -in:spam after:${date.now:date::yyyy-MM-dd}",
          maxMessageCount: -1,
          minMessageCount: 1,
        },
      },
    },
    threads: [
      {
        match: {
          query:
            "from:${user.email} to:${user.email} subject:'Test with office attachments'",
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
                  location: `${GmailProcessorLib.E2EDefaults.DRIVE_TESTS_BASE_PATH}/\${attachment.name}`,
                },
              },
              {
                description: "Store docx file converted to Google Docs format",
                name: "attachment.store",
                args: {
                  conflictStrategy: GmailProcessorLib.ConflictStrategy.REPLACE,
                  location: `${GmailProcessorLib.E2EDefaults.DRIVE_TESTS_BASE_PATH}/\${attachment.name.match.basename}`,
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
                  location: `${GmailProcessorLib.E2EDefaults.DRIVE_TESTS_BASE_PATH}/\${attachment.name}`,
                },
              },
              {
                description:
                  "Store pptx file converted to Google Presentations format",
                name: "attachment.store",
                args: {
                  conflictStrategy: GmailProcessorLib.ConflictStrategy.REPLACE,
                  location: `${GmailProcessorLib.E2EDefaults.DRIVE_TESTS_BASE_PATH}/\${attachment.name.match.basename}`,
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
                  location: `${GmailProcessorLib.E2EDefaults.DRIVE_TESTS_BASE_PATH}/\${attachment.name}`,
                },
              },
              {
                description:
                  "Store xlsx file converted to Google Spreadsheet format",
                name: "attachment.store",
                args: {
                  conflictStrategy: GmailProcessorLib.ConflictStrategy.REPLACE,
                  location: `${GmailProcessorLib.E2EDefaults.DRIVE_TESTS_BASE_PATH}/\${attachment.name.match.basename}`,
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

function issue301Test() {
  const testConfig = issue301TestConfig
  GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.RunMode.DANGEROUS,
  )
}
