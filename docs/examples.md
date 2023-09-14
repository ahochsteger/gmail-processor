# Examples

* [Examples](#examples)
  * [example01.js](#example01js)
  * [example02.js](#example02js)
  * [exampleActionError.js](#exampleactionerrorjs)
  * [exampleMin.js](#exampleminjs)
  * [gettingStartedAddLabel.js](#gettingstartedaddlabeljs)
  * [gettingStarted.js](#gettingstartedjs)
  * [gettingStartedMarkRead.js](#gettingstartedmarkreadjs)
  * [migrationExample01.js](#migrationexample01js)
  * [migrationExampleMin.js](#migrationexampleminjs)

## example01.js

This is a simple configuration example.

```javascript
/**
 * This is a simple configuration example.
 * @type {GmailProcessorLib.Config}
 */
const example01Config = {
  description: "An example V2 configuration",
  settings: {
    markProcessedMethod:
      GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
    maxBatchSize: 10,
    maxRuntime: 280,
    sleepTimeThreads: 100,
    sleepTimeMessages: 0,
    sleepTimeAttachments: 0,
    timezone: "UTC",
  },
  global: {
    thread: {
      match: {
        query: "has:attachment -in:trash -in:drafts -in:spam newer_than:1d",
        maxMessageCount: -1,
        minMessageCount: 1,
      },
      actions: [],
    },
  },
  threads: [
    {
      description:
        "Store all attachments sent to my.name+scans@gmail.com to the folder 'Scans'",
      match: {
        query: "to:my.name+scans@gmail.com",
      },
      actions: [
        {
          name: "thread.storePDF",
          args: {
            folder: "Scans-${message.date:format:yyyy-MM-dd}",
          },
        },
      ],
    },
  ],
}

function example01Run(
  /** @type {EnvContext | undefined} */
  ctx,
) {
  return GmailProcessorLib.run(
    example01Config,
    GmailProcessorLib.RunMode.DRY_RUN,
    ctx,
  )
}
```

Source: [Testing version (maintained)](../src/test/examples/example01.js), [GAS version (generated)](../src/gas/examples/example01.js)

## example02.js

This is a more advanced configuration example.

```javascript
/**
 * This is a more advanced configuration example.
 * @type {GmailProcessorLib.Config}
 */
const example02Config = {
  description: "An example V2 configuration",
  settings: {
    markProcessedMethod:
      GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
    maxBatchSize: 10,
    maxRuntime: 280,
    sleepTimeThreads: 100,
    sleepTimeMessages: 0,
    sleepTimeAttachments: 0,
    timezone: "UTC",
  },
  global: {
    thread: {
      match: {
        query: "has:attachment -in:trash -in:drafts -in:spam newer_than:1d",
        maxMessageCount: -1,
        minMessageCount: 1,
      },
      actions: [],
    },
  },
  messages: [
    {
      description: "Message shorthand config",
      match: {
        subject: "My Subject",
      },
    },
  ],
  attachments: [
    {
      description: "Attachment shorthand config",
      match: {
        name: "my-file-.*",
      },
    },
  ],
  threads: [
    {
      description:
        "Store all attachments sent to my.name+scans@gmail.com to the folder 'Scans'",
      match: {
        query: "to:my.name+scans@gmail.com",
      },
      actions: [
        {
          name: "thread.storePDF",
          args: {
            folder: "Scans-${message.date:format:yyyy-MM-dd}",
          },
        },
      ],
    },
  ],
}

function example02Run(
  /** @type {EnvContext | undefined} */
  ctx,
) {
  return GmailProcessorLib.run(
    example02Config,
    GmailProcessorLib.RunMode.DRY_RUN,
    ctx,
  )
}
```

Source: [Testing version (maintained)](../src/test/examples/example02.js), [GAS version (generated)](../src/gas/examples/example02.js)

## exampleActionError.js

This is an example to immediately cancel processing for special use cases.
It is used for testing the error handling of actions.

```javascript
/**
 * This is an example to immediately cancel processing for special use cases.
 * It is used for testing the error handling of actions.
 * @type {GmailProcessorLib.Config}
 */
const exampleActionErrorConfig = {
  settings: {
    markProcessedMethod:
      GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
    timezone: "UTC",
  },
  global: {
    thread: {
      match: {
        query: "has:attachment -in:trash -in:drafts -in:spam newer_than:1d",
      },
    },
  },
  threads: [
    {
      actions: [
        {
          name: "global.panic",
          args: {
            message: "Test for action error logging",
          },
        },
      ],
    },
  ],
}

function exampleActionErrorRun(
  /** @type {EnvContext | undefined} */
  ctx,
) {
  return GmailProcessorLib.run(
    exampleActionErrorConfig,
    GmailProcessorLib.RunMode.DRY_RUN,
    ctx,
  )
}
```

Source: [Testing version (maintained)](../src/test/examples/exampleActionError.js), [GAS version (generated)](../src/gas/examples/exampleActionError.js)

## exampleMin.js

This is a minimal configuration example, just with the required information.
It just processes files without doing anything, but they will still be marked as processed!
It can be used if you want to start your config from scratch.

```javascript
/**
 * This is a minimal configuration example, just with the required information.
 * It just processes files without doing anything, but they will still be marked as processed!
 * It can be used if you want to start your config from scratch.
 * @type {GmailProcessorLib.Config}
 */
const exampleMinConfig = {
  settings: {
    // Chose a method to mark processed entities:
    markProcessedMethod:
      GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
  },
  threads: [
    {
      // Put thread config here.
    },
  ],
}

/**
 * Function to run the minimal example configuration
 * @param {EnvContext | undefined} ctx Environment context
 * @returns {GmailProcessorLib.ProcessingResult} Processing result
 */
function exampleMinRun(ctx) {
  return GmailProcessorLib.run(
    exampleMinConfig,
    GmailProcessorLib.RunMode.DRY_RUN,
    ctx,
  )
}
```

Source: [Testing version (maintained)](../src/test/examples/exampleMin.js), [GAS version (generated)](../src/gas/examples/exampleMin.js)

## gettingStartedAddLabel.js

This is a getting started example configuration using `ADD_THREAD_LABEL`.

```javascript
/**
 * This is a getting started example configuration using `ADD_THREAD_LABEL`.
 * @type {GmailProcessorLib.Config}
 */
const gettingStartedAddLabelConfig = {
  settings: {
    // Decide on the method to be used to mark processed threads/messages:
    // - mark-read: Mark each processed messages as read (can deal with multiple messages per thread but touches the read status)
    //   "markProcessedMethod": "mark-read"
    // - add-label: Add a label (specified by markProcessedLabel) to the processed thread (unable to deal with multiple messages per thread, but doesn't touch the read status)
    //   "markProcessedMethod": "add-label",
    //   "markProcessedLabel": "GmailProcessor/processed",
    markProcessedMethod: GmailProcessorLib.MarkProcessedMethod.ADD_THREAD_LABEL,
    markProcessedLabel: "GmailProcessor/processed",

    // Add more settings if required ...
  },
  global: {
    // Place global thread, message or attachment configuration here
    thread: {
      match: {
        query:
          "has:attachment -in:trash -in:drafts -in:spam -label:GmailProcessor/processed newer_than:1d",
      },
    },
  },
  threads: [
    // Place thread processing config here
    {
      match: {
        query: "from:some.email@gmail.com",
      },
      attachments: [
        {
          match: {
            name: "^my-file-.+.pdf$",
          },
          actions: [
            {
              name: "thread.storePDF",
              args: {
                folder:
                  "folder/${message.date:format:yyyy-MM-dd}/${attachment.name}",
              },
            },
          ],
        },
      ],
    },
  ],
}

function gettingStartedAddLabelRun(
  /** @type {EnvContext | undefined} */
  ctx,
) {
  return GmailProcessorLib.run(
    gettingStartedAddLabelConfig,
    GmailProcessorLib.RunMode.DRY_RUN,
    ctx,
  )
}
```

Source: [Testing version (maintained)](../src/test/examples/gettingStartedAddLabel.js), [GAS version (generated)](../src/gas/examples/gettingStartedAddLabel.js)

## gettingStarted.js

This is a getting started example configuration.

```javascript
/**
 * This is a getting started example configuration.
 * @type {GmailProcessorLib.Config}
 */
const gettingStartedConfig = {
  settings: {
    markProcessedMethod:
      GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
    // Place settings here
  },
  global: {
    // Place global thread, message or attachment configuration here
  },
  threads: [
    // Place thread processing config here
    {
      match: {
        query: "from:some.email@gmail.com",
      },
      attachments: [
        {
          match: {
            name: "^my-file-.+.pdf$",
          },
          actions: [
            {
              name: "thread.storePDF",
              args: {
                folder:
                  "folder/${message.date:format:yyyy-MM-dd}/${attachment.name}",
              },
            },
          ],
        },
      ],
    },
  ],
}

function gettingStartedRun(
  /** @type {EnvContext | undefined} */
  ctx,
) {
  return GmailProcessorLib.run(
    gettingStartedConfig,
    GmailProcessorLib.RunMode.DRY_RUN,
    ctx,
  )
}
```

Source: [Testing version (maintained)](../src/test/examples/gettingStarted.js), [GAS version (generated)](../src/gas/examples/gettingStarted.js)

## gettingStartedMarkRead.js

This is a getting started example configuration using `MARK_MESSAGE_READ`.

```javascript
/**
 * This is a getting started example configuration using `MARK_MESSAGE_READ`.
 * @type {GmailProcessorLib.Config}
 */
const gettingStartedMarkReadConfig = {
  settings: {
    // Decide on the method to be used to mark processed threads/messages:
    // - mark-read: Mark each processed messages as read (can deal with multiple messages per thread but touches the read status)
    //   "markProcessedMethod": "mark-read"
    // - add-label: Add a label (specified by markProcessedLabel) to the processed thread (unable to deal with multiple messages per thread, but doesn't touch the read status)
    //   "markProcessedMethod": "add-label",
    //   "markProcessedLabel": "GmailProcessor/processed",
    markProcessedMethod:
      GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,

    // Add more settings if required ...
  },
  global: {
    // Place global thread, message or attachment configuration here
    thread: {
      match: {
        query:
          "has:attachment -in:trash -in:drafts -in:spam is:unread newer_than:1d",
      },
    },
  },
  threads: [
    // Place thread processing config here
    {
      match: {
        query: "from:some.email@gmail.com",
      },
      attachments: [
        {
          match: {
            name: "^my-file-.+.pdf$",
          },
          actions: [
            {
              name: "thread.storePDF",
              args: {
                folder:
                  "folder/${message.date:format:yyyy-MM-dd}/${attachment.name}",
              },
            },
          ],
        },
      ],
    },
  ],
}

function gettingStartedMarkReadRun(
  /** @type {EnvContext | undefined} */
  ctx,
) {
  return GmailProcessorLib.run(
    gettingStartedMarkReadConfig,
    GmailProcessorLib.RunMode.DRY_RUN,
    ctx,
  )
}
```

Source: [Testing version (maintained)](../src/test/examples/gettingStartedMarkRead.js), [GAS version (generated)](../src/gas/examples/gettingStartedMarkRead.js)

## migrationExample01.js

This is a Gmail2GDrive v1.x configuration example to demostrate the conversion to the Gmail Processor v2.x config format.

```javascript
/**
 * This is a Gmail2GDrive v1.x configuration example to demostrate the conversion to the Gmail Processor v2.x config format.
 * @type {GmailProcessorLib.V1Config}
 */
const migrationExample01Config = {
  globalFilter: "has:attachment -in:trash -in:drafts -in:spam",
  processedLabel: "gmail2gdrive/client-test",
  sleepTime: 100,
  maxRuntime: 280,
  newerThan: "1d",
  timezone: "GMT",
  rules: [
    {
      filter: "to:my.name+scans@gmail.com",
      folder: "'Scans'-yyyy-MM-dd",
    },
    {
      filter: "from:example1@example.com",
      folder: "'Examples/example1'",
    },
    {
      filter: "from:example2@example.com",
      folder: "'Examples/example2'",
      filenameFromRegexp: ".*.pdf$",
    },
    {
      filter: "(from:example3a@example.com OR from:example3b@example.com)",
      folder: "'Examples/example3ab'",
      filenameTo: "'file-'yyyy-MM-dd-'%s.txt'",
      archive: true,
    },
    {
      filter: "label:PDF",
      saveThreadPDF: true,
      folder: "'PDF Emails'",
    },
    {
      filter: "from:example4@example.com",
      folder: "'Examples/example4'",
      filenameFrom: "file.txt",
      filenameTo: "'file-'yyyy-MM-dd-'%s.txt'",
    },
  ],
}

function migrationExample01ConvertConfig() {
  const config = GmailProcessorLib.convertV1Config(migrationExample01Config)
  console.log(JSON.stringify(config, null, 2))
  return config
}
```

Source: [Testing version (maintained)](../src/test/examples/migrationExample01.js), [GAS version (generated)](../src/gas/examples/migrationExample01.js)

## migrationExampleMin.js

This is a minimal Gmail2GDrive v1.x configuration example to demostrate the conversion to the Gmail Processor v2.x config format.

```javascript
/**
 * This is a minimal Gmail2GDrive v1.x configuration example to demostrate the conversion to the Gmail Processor v2.x config format.
 * @type {GmailProcessorLib.V1Config}
 */
const migrationExampleMinConfig = {
  processedLabel: "gmail2gdrive/client-test",
  sleepTime: 100,
  maxRuntime: 280,
  newerThan: "2m",
  timezone: "GMT",
  rules: [
    {
      filter: "to:my.name+scans@gmail.com",
      folder: "'Scans'-yyyy-MM-dd",
    },
  ],
}

function migrationExampleMinConvertConfig() {
  const config = GmailProcessorLib.convertV1Config(migrationExampleMinConfig)
  console.log(JSON.stringify(config, null, 2))
  return config
}
```

Source: [Testing version (maintained)](../src/test/examples/migrationExampleMin.js), [GAS version (generated)](../src/gas/examples/migrationExampleMin.js)
