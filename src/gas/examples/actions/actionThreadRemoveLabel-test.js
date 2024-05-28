// NOTE: Do not edit this auto-generated file!
// Template: src/templates/gas-test.eta
// Source: src/examples/actions/actionThreadRemoveLabel.ts

function actionThreadRemoveLabelTest() {
  /**
   * This example demonstrates the usage of the action `thread.removeLabel`.
   * It is also used to test a possible behavioral change for certain characters in label names (e.g. `-` vs. `/`).
   */
  const info = {
    name: "actionThreadRemoveLabel",
    title: "Remove Thread Label",
    description:
      "The action `thread.removeLabel` removes a label from a thread.",
    category: "actions",
    issues: [303],
  }

  const initConfig = {
    mails: [{}],
  }

  const runConfig = {
    description: info.description,
    global: {
      thread: {
        match: {
          query: `from:\${user.email} to:\${user.email} after:\${date.now:date::yyyy-MM-dd} subject:'${GmailProcessorLib.E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}'`,
        },
      },
    },
    settings: {
      markProcessedMethod: GmailProcessorLib.MarkProcessedMethod.CUSTOM,
    },
    threads: [
      {
        match: {
          query: `subject:([GmailProcessor-Test] ${info.name})`,
        },
        actions: [
          {
            name: "thread.addLabel",
            processingStage: GmailProcessorLib.ProcessingStage.PRE_MAIN,
            args: {
              name: "accounting-process",
            },
          },
          {
            name: "thread.markRead",
            processingStage: GmailProcessorLib.ProcessingStage.POST_MAIN,
          },
          {
            name: "thread.removeLabel",
            processingStage: GmailProcessorLib.ProcessingStage.POST_MAIN,
            args: {
              name: "accounting-process",
            },
          },
          {
            name: "thread.addLabel",
            processingStage: GmailProcessorLib.ProcessingStage.POST_MAIN,
            args: {
              name: "accounting-autoinvoice",
            },
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
            procResult.processedThreads * 4,
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

  GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.RunMode.DANGEROUS,
  )
}
