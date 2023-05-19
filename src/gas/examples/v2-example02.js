/* global GMail2GDrive */

var example02ConfigV2 = {
  description: "An example V2 configuration",
  settings: {
    maxBatchSize: 10,
    maxRuntime: 280,
    processedMode: "read",
    sleepTimeThreads: 100,
    sleepTimeMessages: 0,
    sleepTimeAttachments: 0,
    timezone: "UTC",
  },
  global: {
    match: {
      query: "has:attachment -in:trash -in:drafts -in:spam",
      maxMessageCount: -1,
      minMessageCount: 1,
      newerThan: "1d",
    },
    actions: [],
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
          name: "attachment.storeToGDrive",
          args: {
            folder: "Scans-${message.date:dateformat:yyyy-MM-dd}",
          },
        },
      ],
    },
  ],
}

function example02EffectiveConfig() {
  const effectiveConfig = GMail2GDrive.Lib.getEffectiveConfig(example02ConfigV2)
  console.log(JSON.stringify(effectiveConfig), null, 2)
}

function example02Run() {
  GMail2GDrive.Lib.runWithV1Config(example02ConfigV2, "dry-run")
}