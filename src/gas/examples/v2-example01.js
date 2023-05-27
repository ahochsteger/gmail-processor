/* global GMail2GDrive */

var example01ConfigV2 = {
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
    thread: {
      match: {
        query: "has:attachment -in:trash -in:drafts -in:spam",
        maxMessageCount: -1,
        minMessageCount: 1,
        newerThan: "1d",
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
          name: "thread.storeAsPdfToGDrive",
          args: {
            folder: "Scans-${message.date:dateformat:yyyy-MM-dd}",
          },
        },
      ],
    },
  ],
}

function example01EffectiveConfig() {
  const effectiveConfig = GMail2GDrive.Lib.getEffectiveConfig(example01ConfigV2)
  console.log(JSON.stringify(effectiveConfig, null, 2))
}

function example01Run() {
  GMail2GDrive.Lib.run(example01ConfigV2, "dry-run")
}
