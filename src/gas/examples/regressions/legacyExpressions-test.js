// NOTE: Do not edit this auto-generated file!
// Template: src/templates/gas-test.eta
// Source: src/examples/regressions/legacyExpressions.ts

function legacyExpressionsTestConfig() {
  /**
   * This example uses legacy expressions that are deprecated but still should work until support is finally removed.
   */
  const info = {
    name: "legacyExpressions",
    title: "Legacy Expressions",
    description:
      "This example uses legacy expressions that are deprecated but still should work until support is finally removed.",
    category: "regressions",
  }

  const initConfig = {
    mails: [{}],
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
          query: `has:attachment -in:trash -in:drafts -in:spam after:\${date.now:date::yyyy-MM-dd'} is:unread subject:"${GmailProcessorLib.E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}"`,
        },
      },
      variables: [
        { key: "date1", value: "date1: ${date.now:date:-1d}" },
        { key: "date2", value: "date2: ${date.now:date:-1d:yyyy-MM-dd}" },
        { key: "date3", value: "date3: ${date.now:date::yyyy-MM-dd}" },
        { key: "format1", value: "date1: ${date.now:format}" },
        { key: "format2", value: "date2: ${date.now:format:yyyy-MM-dd}" },
        { key: "join1", value: "join1: ${date.now:join}" },
        { key: "join2", value: "join2: ${date.now:join:-}" },
        {
          key: "offset-date1",
          value: "offset-date1: ${date.now:offset-format:-1d}",
        },
        {
          key: "offset-date2",
          value: "offset-date2: ${date.now:offset-format:-1d:yyyy-MM-dd}",
        },
        {
          key: "offset-date3",
          value: "offset-date3: ${date.now:offset-format::yyyy-MM-dd}",
        },
      ],
    },
    threads: [{}],
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

function legacyExpressionsTest() {
  const testConfig = legacyExpressionsTestConfig()
  return GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.RunMode.DANGEROUS,
  )
}
