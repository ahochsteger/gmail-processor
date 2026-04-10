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
      message: "Successful execution",
      assertions: [
        {
          message: "One thread config should have been processed",
          assertFn: (_testConfig, procResult) =>
            procResult.processedThreadConfigs === 1,
        },
        {
          message: "One thread should have been processed",
          assertFn: (_testConfig, procResult) =>
            procResult.processedThreads === 1,
        },
        {
          message: "One message should have been processed",
          assertFn: (_testConfig, procResult) =>
            procResult.processedMessages === 1,
        },
        {
          message: "One attachment config should have been processed",
          assertFn: (_testConfig, procResult) =>
            procResult.processedAttachmentConfigs === 1,
        },
        {
          message: "One attachment should have been processed",
          assertFn: (_testConfig, procResult) =>
            procResult.processedAttachments === 1,
        },
        {
          message: "Correct number of actions should have been executed",
          assertFn: (_testConfig, procResult) =>
            procResult.executedActions.length === 3,
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

function conflictStrategyTest() {
  const testConfig = conflictStrategyTestConfig()
  return GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.RunMode.DANGEROUS,
    GmailProcessorLib.EnvProvider.defaultContext(
      GmailProcessorLib.RunMode.DANGEROUS,
      {
        cacheService: CacheService,
        propertiesService: PropertiesService,
      },
    ),
  )
}
