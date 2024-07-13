// NOTE: Do not edit this auto-generated file!
// Template: src/templates/gas-test.eta
// Source: src/examples/advanced/customActions.ts

function customActionsTestConfig() {
  /**
   * This is an example to demonstrate custom actions.
   */
  const info = {
    name: "customActions",
    title: "Custom Actions",
    description:
      "Define custom logic as actions that can be executed during processing.",
    category: "advanced",
    variant: "custom-actions",
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
    settings: {
      markProcessedMethod:
        GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
    },
    global: {
      thread: {
        match: {
          query: `has:attachment -in:trash -in:drafts -in:spam after:\${date.now:date::yyyy-MM-dd} is:unread subject:"${GmailProcessorLib.E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}"`,
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
            actions: [
              {
                name: "custom.mylog",
                args: {
                  arg1: "value1",
                  arg2: "value2",
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
    customActions: [
      {
        name: "mylog",
        action: (ctx, args) =>
          ctx.log.info(`Called with args '${JSON.stringify(args)}' ...`),
      },
    ],
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
          message: "At least one message should have been processed",
          assertFn: (_testConfig, procResult) =>
            procResult.processedMessages >= 1,
        },
        {
          message: "Expected number of actions should have been executed",
          assertFn: (_testConfig, procResult) =>
            procResult.executedActions.length ===
            2 * procResult.processedMessages,
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

function customActionsTest() {
  const testConfig = customActionsTestConfig()
  return GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.RunMode.DANGEROUS,
  )
}
