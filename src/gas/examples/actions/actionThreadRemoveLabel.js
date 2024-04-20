// NOTE: Do not edit this auto-generated file!
// Template: src/examples/_templates/test-e2e.tmpl
// Source: src/examples/actions/actionThreadRemoveLabel.ts

function actionThreadRemoveLabelTest() {
  const info = {
    name: "actionThreadRemoveLabel",
    title: "thread.removeLabel",
    description:
      "Demonstrates the usage of the action `thread.removeLabel` and is used to test a possible behavioral change for label names (e.g. `-` vs. `/`).",
    category: "actions",
    generate: ["docs", "test-e2e", "test-spec"],
    issues: [303],
    schemaVersion: "v2",
  }

  const initConfig = {
    mails: [{ subject: info.name }],
  }

  const runConfig = {
    description: info.description,
    global: {
      thread: {
        match: {
          query:
            "from:${user.email} to:${user.email} after:${date.now:date::yyyy-MM-dd}",
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

  const actionThreadRemoveLabelExample = {
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
