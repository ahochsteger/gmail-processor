// NOTE: Do not edit this auto-generated file!
// Template: src/templates/gas-test.eta
// Source: src/examples/advanced/headerMatching.ts

function headerMatchingTestConfig() {
  /** This example demonstrates how to use the `rawHeaders` property in the message matching configuration.
   * It allows matching messages based on the content of their raw headers using regular expressions.
   *
   * In this specific example:
   * 1.  It first matches threads sent by the current user (`from:${user.email}`).
   * 2.  Within those threads, it matches messages where the raw headers contain a `From:` line exactly matching the user's email address (`(?m)^From: ${user.email}$`). Note the use of `(?m)` at the beginning of the regex to allow matching `^` and `$` at start/end of line (multi-line matching).
   * 3.  For matching messages, it processes attachments named `invoice.pdf`.
   * 4.  Matching attachments are stored in Google Drive using a dynamically generated path based on message and attachment details.
   */
  const info = {
    name: "headerMatching",
    title: "Header Matching",
    description: "This example demonstrates how to match raw message headers.",
    category: "advanced",
  }

  const initConfig = {
    mails: [
      {
        attachments: ["invoice.pdf"],
      },
    ],
  }

  const runConfig = {
    description: info.description,
    settings: {
      // ATTENTION: Decide on the method to be used to mark processed threads/messages:
      markProcessedMethod:
        GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
      // Add more settings if required ...
    },
    global: {
      // Place global thread, message or attachment configuration here
      thread: {
        match: {
          query: `has:attachment -in:trash -in:drafts -in:spam after:{{date.now|formatDate('yyyy-MM-dd')}} is:unread subject:"${GmailProcessorLib.E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}"`,
        },
      },
    },
    threads: [
      // Place thread processing config here
      {
        match: {
          query: "from:${user.email}",
        },
        messages: [
          // Place message processing config here
          {
            match: {
              rawHeaders: "(?m)^From: ${user.email}$",
            },
            attachments: [
              // Place attachment processing config here
              {
                match: {
                  name: "^invoice\\.pdf$",
                },
                actions: [
                  {
                    name: "attachment.store",
                    args: {
                      location: `${GmailProcessorLib.E2EDefaults.DRIVE_TESTS_BASE_PATH}/${info.name}/{{message.date|formatDate('yyyy-MM-dd')}}/{{message.subject}}-{{attachment.name}}`,
                      conflictStrategy: GmailProcessorLib.ConflictStrategy.KEEP,
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

function headerMatchingTest() {
  const testConfig = headerMatchingTestConfig()
  return GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.RunMode.DANGEROUS,
  )
}
