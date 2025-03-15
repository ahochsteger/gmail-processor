// NOTE: Do not edit this auto-generated file!
// Template: src/templates/gas-test.eta
// Source: src/examples/advanced/regularExpressions.ts

function regularExpressionsTestConfig() {
  /**
   * This example demonstrates how to use regular expressions in the configuration.
   *
   * It does to following with the message subject:
   * * Ignores a common subject prefix
   * * Captures the school name using the capture group `(?<school>...)`
   * * Captures the report type using the capture group `(?<reportType>...)`
   * * Captures the report sub type using the capture group `(?<reportSubType>...)`
   * * Capture the date as the final part of the subject using the capture group `(?<date>...)`
   *
   * The extracted data is finally used to dynamically define the location of the attachment to be stored using:
   * `.../Reports/{{message.subject.match.school}}/All Reports/{{message.subject.match.reportType}}/{{message.subject.match.reportSubType}}/{{message.subject.match.date}}-{{attachment.name}}`
   *
   * Flags like searching for the case-insensitive string are also supported by prefixing the regex with `(?<flags>)` like `(?i)...`.
   */
  const info = {
    name: "regularExpressions",
    title: "Regular Expressions",
    description:
      "Regular expressions allow to define patterns and extract values to simplify the configuration.",
    category: "advanced",
    skipGenerate: ["test-spec"],
  }

  const initConfig = {
    mails: [
      {
        subject: `${info.name} School A-Internal-Reading-{{date.now|formatDate('yyyy-MM-dd')}}`,
        attachments: ["sample.docx"],
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
          query: "from:${user.email}",
        },
        messages: [
          {
            name: "extract-message-fields-from-subject",
            match: {
              subject: `${info.name} (?<school>[^-]+)-(?<reportType>[^-]+)-(?<reportSubType>[^-]+)-(?<date>[0-9-]+)`,
            },
            attachments: [
              {
                match: {
                  name: "^sample\\.docx$",
                },
                actions: [
                  {
                    name: "attachment.store",
                    args: {
                      location: `${GmailProcessorLib.E2EDefaults.DRIVE_TESTS_BASE_PATH}/${info.name}/Reports/{{message.subject.match.school}}/All Reports/{{message.subject.match.reportType}}/{{message.subject.match.reportSubType}}/{{message.subject.match.date}}-{{attachment.name}}`,
                      conflictStrategy:
                        GmailProcessorLib.ConflictStrategy.UPDATE,
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

  const example = {
    info,
    config: runConfig,
  }

  const tests = [
    {
      message: "No failures",
      assertions: [
        {
          message: "Processing status should be OK",
          assertFn: (_testConfig, procResult) =>
            procResult.status === GmailProcessorLib.ProcessingStatus.OK,
        },
        {
          message: "At least one thread should have been processed",
          assertFn: (_testConfig, procResult) =>
            procResult.processedThreads >= 1,
        },
        {
          message: "Expected number of actions should have been executed",
          assertFn: (_testConfig, procResult) =>
            procResult.executedActions.length ===
            procResult.processedThreads + procResult.processedAttachments,
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

function regularExpressionsTest() {
  const testConfig = regularExpressionsTestConfig()
  return GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.RunMode.DANGEROUS,
  )
}
