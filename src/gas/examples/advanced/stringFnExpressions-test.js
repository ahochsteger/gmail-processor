// NOTE: Do not edit this auto-generated file!
// Template: src/templates/gas-test.eta
// Source: src/examples/advanced/stringFnExpressions.ts

function stringFnExpressionsTestConfig() {
  /**
   * This example shows how to use string functions within expressions.
   *
   * The following string functions are supported:
   * - replace(searchRegexp, replacement)
   * - replaceAll(searchRegexp, replacement)
   * - slice(start, end)
   * - substring(start, end)
   * - trimStart()
   * - trimEnd()
   * - trim()
   * - toUpperCase()
   * - toLowerCase()
   */
  const info = {
    name: "stringFnExpressions",
    title: "String Function Expressions",
    description:
      "This example demonstrates how to use string function expressions in the configuration.",
    category: "advanced",
    discussions: [549],
    skipGenerate: [],
  }
  const initConfig = {
    mails: [
      {}, // just an empty default email
    ],
  }

  const runConfig = {
    description: info.description,
    global: {
      thread: {
        match: {
          query: `-in:trash -in:drafts -in:spam from:{{user.email}} to:{{user.email}} after:{{date.now|formatDate('yyyy-MM-dd')}} is:unread subject:"${GmailProcessorLib.E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}"`,
        },
      },
    },
    settings: {
      markProcessedMethod:
        GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
      logSensitiveRedactionMode: GmailProcessorLib.LogRedactionMode.NONE,
    },
    threads: [
      {
        match: {
          query: "", // TODO: Analyze why this is required - maybe has:attatchments is added automatically here (which is unexpected)!
        },
        messages: [
          {
            actions: [
              {
                name: "global.log",
                args: {
                  message:
                    "Removing '[]' from subject: {{message.subject|replaceAll('[\\[\\]]', '')}}",
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
            2 * procResult.processedMessages,
        },
        {
          message: "The correct message should have been logged",
          assertFn: (_testConfig, procResult, ctx, expect) =>
            expect(
              ctx,
              procResult.executedActions[0]?.result?.logMessage,
              `Removing '[]' from subject: GmailProcessor-Test ${info.name}`,
              "Actual log message does not match the expected one",
            ),
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

function stringFnExpressionsTest() {
  const testConfig = stringFnExpressionsTestConfig()
  return GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.RunMode.DANGEROUS,
  )
}
