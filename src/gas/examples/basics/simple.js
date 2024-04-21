// NOTE: Do not edit this auto-generated file!
// Template: src/examples/_templates/test-e2e.tmpl
// Source: src/examples/basics/simple.ts

function simpleTest() {
  const info = {
    name: "simple",
    title: "Simple",
    description: "This is a simple example to start with Gmail Processor.",
    category: "basics",
    generate: ["docs", "test-e2e", "test-spec"],
    schemaVersion: "v2",
  }

  const initConfig = {
    mails: [
      {
        attachments: ["invoice.pdf"],
      },
    ],
  }

  const runConfig = {
    description: info.description,
    settings: {
      // Decide on the method to be used to mark processed threads/messages:
      // MARK_MESSAGE_READ: Mark each processed messages as read (can deal with multiple messages per thread but touches the read status)
      // markProcessedMethod:
      //   GmailProcessorLib.GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
      // ADD_THREAD_LABEL: Add a label (specified by markProcessedLabel) to the processed thread (unable to deal with multiple messages per thread, but doesn't touch the read status)
      markProcessedMethod:
        GmailProcessorLib.MarkProcessedMethod.ADD_THREAD_LABEL,
      markProcessedLabel: "GmailProcessor/processed",

      // Add more settings if required ...
    },
    global: {
      // Place global thread, message or attachment configuration here
      thread: {
        match: {
          query:
            "has:attachment -in:trash -in:drafts -in:spam after:${date.now:date::yyyy-MM-dd}",
        },
      },
    },
    threads: [
      // Place thread processing config here
      {
        match: {
          query: "from:some.email@gmail.com",
        },
        messages: [
          // Place message processing config here
          {
            attachments: [
              // Place attachment processing config here
              {
                match: {
                  name: "^invoice\\.pdf$",
                },
                actions: [
                  {
                    name: "thread.storePDF",
                    args: {
                      location:
                        "folder/${message.date:date::yyyy-MM-dd}/${message.subject}-${attachment.name.match.fileid}.pdf",
                      conflictStrategy: GmailProcessorLib.ConflictStrategy.KEEP,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }

  const simpleExample = {
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
