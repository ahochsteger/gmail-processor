// NOTE: Do not edit this auto-generated file!
// Template: src/templates/gas-test.eta
// Source: src/examples/advanced/dateExpressions.ts

function dateExpressionsTestConfig() {
  const info = {
    name: "dateExpressions",
    title: "Date Expressions",
    description:
      "This example demonstrates how to use date expressions in the configuration.",
    category: "advanced",
    issues: [297, 345],
    skipGenerate: [],
  }
  // Example: {{message.date|offsetDate('startOfMonth-1d')|formatDate('yyyy-MM-dd')}}
  // See https://github.com/ahochsteger/gmail-processor/pull/297#issuecomment-1983222054

  const initConfig = {
    mails: [
      {
        body: "US date: 7/14/2024, German date: 14.7.2024, Short German date: 14.7.24, ISO date: 2024-07-14",
      },
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
            match: {
              body: "US date: (?<usDate>[0-9\\/]+), German date: (?<germanDate>[0-9\\.]+), Short German date: (?<shortGermanDate>[0-9\\.]+), ISO date: (?<isoDate>[0-9-]+)",
            },
            actions: [
              {
                name: "global.log",
                args: {
                  message:
                    "Extracted dates US:{{message.body.match.usDate|parseDate('M/d/yyyy')|formatDate('yyyy-MM-dd')}}, DE:{{message.body.match.germanDate|parseDate('d.M.yyyy')|formatDate('yyyy-MM-dd')}}, DE (short):{{message.body.match.shortGermanDate|parseDate('d.M.yy')|formatDate('yyyy-MM-dd')}}, ISO:{{message.body.match.isoDate|parseDate('yyyy-MM-dd')|formatDate('yyyy-MM-dd')}}",
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
              "Extracted dates US:2024-07-14, DE:2024-07-14, DE (short):2024-07-14, ISO:2024-07-14",
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

function dateExpressionsTest() {
  const testConfig = dateExpressionsTestConfig()
  return GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.RunMode.DANGEROUS,
  )
}
