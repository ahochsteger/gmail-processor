const example01ConfigV2 = {
  description: "An example V2 configuration",
  settings: {
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

function example01Run() {
  GmailProcessorLib.run(example01ConfigV2, "dry-run")
}