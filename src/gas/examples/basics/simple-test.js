// NOTE: Do not edit this auto-generated file!
// Template: src/templates/gas-test.eta
// Source: src/examples/basics/simple.ts

function simpleTestConfig() {
  /**
   * This is a simple example to start with Gmail Processor.
   *
   * There's one **critical decision** to be taken about how threads or messages should be marked as processed to prevent multiple processing.
   * * **`mark-read`:** Mark processed messages as read. This is the recommended method to get started, because it also can deal with multiple messages per thread.
   *   - PROS: Can process additional messages within the same thread even after a thread has already been processed.
   *   - CONS: Marks the processed messages as read, which may not be what you want to have.
   * * **`add-label`:** Mark processed threads by attaching the label configured using `markProcessedLabel`. This is recommended for simple cases with just a single message in each processed thread.
   *   - PROS: Keeps processed messages in an unread state.
   *   - CONS: Cannot process additional messages that may be added after a thread has already been processed.
   * * **`custom`:**: Leaves the decision on how to remember processed threads/messages to the user of the library using certain actions.
   *   - PROS: Most flexible, can deal with many edge cases using one of the many actions (e.g. `moveToArchive`, `moveToTrash`, `star`, `markRead`, `markImportant`, `addLabel`)
   *   - CONS: Great care has to be taken that the matching configuration and the actions to mark entities as processed fit together. Otherwise they may get processed over and over again.
   *
   * You can put match configs which should m
   * The primary configuration resides in a nested list of config structures with the following parts:
   * * `threads`:
   *   * Defines which threads should be queried and matched in the `match` section.
   *   * Defines which actions should be executed for matching threads in the `actions` section.
   *   * Delegates processing of further messages to the `messages` section.
   * * `messages`:
   *   * Defines which messages should be matched in the `match` section.
   *   * Defines which actions should be executed for matching messages in the `actions` section.
   *   * Delegates processing of further attachments to the `attachments` section.
   * * `attachments`:
   *   * Defines which attachments should be matched in the `match` section.
   *   * Defines which actions should be executed for matching attachments in the `actions` section.
   *
   * Matches or actions that should always be taken into account for every thread/message/attachment can be put into the global section.
   *
   * This example uses a global thread match query to ensure only threads that comply to these criteria should be processed:
   * * has attachments
   * * is not in trash
   * * is not in spam
   * * is not a draft
   * * contains messages after a certain date
   * * contains messages with a certain subject
   *
   * The processing continues by restricting the query to threads where the user is the sender.
   * Since the messages section does not have any additional matcher, all messages in the thread will be processed.
   * In the attachments section the `match` section restricts processing to attachments that have the name `invoice.pdf` using a regular expression.
   * Matching attachments will then be stored at the given location using [placeholder substitution](https://ahochsteger.github.io/gmail-processor/docs/reference/placeholder) to dynamically create the location based on thread/message/attachment data.
   */
  const info = {
    name: "simple",
    title: "Store Attachment",
    description:
      "Use this to get started with Gmail Processor. It stores an attachment to Google Drive.",
    category: "basics",
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
      // ATTENTION: Decide on the method to be used to mark processed threads/messages:
      markProcessedMethod:
        GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
      // Add more settings if required ...
    },
    global: {
      // Place global thread, message or attachment configuration here
      thread: {
        match: {
          query: `has:attachment -in:trash -in:drafts -in:spam after:\${date.now:date::yyyy-MM-dd} subject:'${GmailProcessorLib.E2EDefaults.EMAIL_SUBJECT_PREFIX}${info.name}'`,
        },
      },
    },
    threads: [
      // Place thread processing config here
      {
        match: {
          query: "from:${user.email}",
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
                    name: "attachment.store",
                    args: {
                      location: `${GmailProcessorLib.E2EDefaults.DRIVE_TESTS_BASE_PATH}/${info.name}/\${message.date:date::yyyy-MM-dd}/\${message.subject}-\${attachment.name}`,
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
            procResult.processedThreads + procResult.processedAttachments,
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

function simpleTest() {
  const testConfig = simpleTestConfig
  GmailProcessorLib.E2E.runTests(
    testConfig,
    false,
    E2E_REPO_BRANCH,
    GmailProcessorLib.RunMode.DANGEROUS,
  )
}
