/** @generated - DO NOT EDIT MANUALLY - Use 'npm run update:examples' instead */
// NOTE: Do not edit this auto-generated file!
// Template: src/templates/gas-test.eta
// Source: src/examples/features/conflictStrategy.ts

function conflictStrategyTestConfig() {
  const info = {
    name: "conflictStrategy",
    title: "Conflict Strategy",
    description: "Test different conflict strategies like increment.",
    category: "features",
  }

  const initConfig = {
    mails: [
      {
        attachments: ["sample.txt"],
      },
    ],
  }

  const runConfig = {
    description: info.description,
    settings: {
      logSheetLocation:
        "/GmailProcessor-Tests/logsheet-{{date.now|formatDate('yyyy-MM')}}",
      markProcessedMethod:
        GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
    },
    global: {
      thread: {
        match: {
          query: `has:attachment -in:trash -in:drafts -in:spam after:{{date.now|formatDate('yyyy-MM-dd')}} is:unread subject:"${GmailProcessorLib.E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}"`,
          maxMessageCount: -1,
          minMessageCount: 1,
        },
      },
    },
    threads: [
      {
        match: {
          query: "from:{{user.email}} to:{{user.email}}",
        },
        attachments: [
          {
            description: "Process *.txt attachment files",
            match: {
              name: "(?<basename>.+)\\.txt$",
            },
            actions: [
              {
                description: "Store original txt file",
                name: "attachment.store",
                args: {
                  conflictStrategy: GmailProcessorLib.ConflictStrategy.REPLACE,
                  location: `${GmailProcessorLib.E2EDefaults.driveTestBasePath(info)}/{{attachment.name}}`,
                },
              },
              {
                description:
                  "Store the same txt file again with increment strategy",
                name: "attachment.store",
                args: {
                  conflictStrategy:
                    GmailProcessorLib.ConflictStrategy.INCREMENT,
                  incrementPrefix: "_",
                  incrementSuffix: "",
                  incrementStart: 2,
                  location: `${GmailProcessorLib.E2EDefaults.driveTestBasePath(info)}/{{attachment.name}}`,
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
      message: "Execution should be successful",
      assertions: [
        {
          message: "Should have executed storage with REPLACE strategy",
          assertFn: (_testConfig, _procResult, _ctx, _expect, h) => {
            const a = h.findNextAction("attachment.store", {
              "arg.conflictStrategy":
                GmailProcessorLib.ConflictStrategy.REPLACE,
            })
            return (
              h.expectStatus() &&
              h.expectActionExecuted(a, "REPLACE action") &&
              h.expectActionMeta(
                a,
                "attachment.stored.location",
                /.*\/sample\.txt$/,
              )
            )
          },
        },
        {
          message: "Should have executed storage with INCREMENT strategy",
          assertFn: (_testConfig, _procResult, _ctx, _expect, h) => {
            const a = h.findNextAction("attachment.store", {
              "arg.conflictStrategy":
                GmailProcessorLib.ConflictStrategy.INCREMENT,
            })
            return (
              h.expectActionExecuted(a, "INCREMENT action") &&
              h.expectActionMeta(
                a,
                "attachment.stored.location",
                /.*\/sample_2\.txt$/,
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

async function conflictStrategyTest() {
  const testConfig = conflictStrategyTestConfig()
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
