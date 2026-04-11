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
          query: `has:attachment -in:trash -in:drafts -in:spam after:{{date.now|formatDate('yyyy-MM-dd')}} is:unread subject:"${GmailProcessorLib.E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}"`,
        },
      },
    },
    threads: [
      {
        match: {
          query: "from:{{user.email}}",
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
      message: "Execution should be successful",
      assertions: [
        {
          message:
            "Custom action should have been called with correct arguments",
          assertFn: (_testConfig, _procResult, _ctx, _expect, h) => {
            const a = h.findAction("custom.mylog")
            return (
              h.expectStatus() &&
              h.expectActionExecuted(a, "custom.mylog") &&
              h.expect(
                _ctx,
                Reflect.get(a?.config.args ?? {}, "arg1"),
                "value1",
                "arg1",
              ) &&
              h.expect(
                _ctx,
                Reflect.get(a?.config.args ?? {}, "arg2"),
                "value2",
                "arg2",
              )
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

async function customActionsTest() {
  const testConfig = customActionsTestConfig()
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
