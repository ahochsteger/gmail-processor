// NOTE: Do not edit this auto-generated file!
// Template: src/templates/gas-test.eta
// Source: src/examples/actions/actionThreadRemoveLabel.ts

function actionThreadRemoveLabelTestConfig() {
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
          query: `from:{{user.email}} to:{{user.email}} after:{{date.now|formatDate('yyyy-MM-dd')}} subject:'${GmailProcessorLib.E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}'`,
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
      message: "Execution should be successful",
      assertions: [
        {
          message: "Labels should have been managed correctly",
          assertFn: (_testConfig, _procResult, _ctx, _expect, h) => {
            const add0 = h.findNextAction("thread.addLabel", {
              "arg.name": "accounting-process",
            })
            const rm = h.findNextAction("thread.removeLabel", {
              "arg.name": "accounting-process",
            })
            const add1 = h.findNextAction("thread.addLabel", {
              "arg.name": "accounting-autoinvoice",
            })
            return (
              h.expectStatus() &&
              h.expectActionExecuted(add0, "thread.addLabel (process)") &&
              h.expectActionExecuted(rm, "thread.removeLabel") &&
              h.expectActionExecuted(add1, "thread.addLabel (autoinvoice)")
            )
          },
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

async function actionThreadRemoveLabelTest() {
  const testConfig = actionThreadRemoveLabelTestConfig()
  return await GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.EnvProvider.defaultContext({
      runMode: GmailProcessorLib.RunMode.DANGEROUS,
      cacheService: CacheService,
      propertiesService: PropertiesService,
    }),
  )
}
