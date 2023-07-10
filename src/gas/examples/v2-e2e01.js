/* global GMail2GDrive */

var e2e01ConfigV2 = {
  description: "An example V2 configuration",
  settings: {
    maxBatchSize: 10,
    maxRuntime: 280,
    markProcessedMethod: "mark-read",
    sleepTimeThreads: 100,
    sleepTimeMessages: 0,
    sleepTimeAttachments: 0,
    timezone: "UTC",
  },
  global: {
    thread: {
      match: {
        query: "has:attachment -in:trash -in:drafts -in:spam after:2023-06-19",
        maxMessageCount: -1,
        minMessageCount: 1,
      },
      actions: [],
    },
  },
  threads: [
    {
      match: {
        query:
          "from:${user.email} to:${user.email} subject:'GMail2GDrive-Test'",
      },
      attachments: [
        {
          match: {
            name: "^(?<basename>.+).png$",
          },
          actions: [
            {
              name: "attachment.store",
              args: {
                location:
                  "/GMail2GDrive-Tests/v2/e2e01/${attachment.name.match.basename}-stored.png",
              },
            },
          ],
        },
      ],
    },
  ],
}

function e2e01EffectiveConfig() {
  const effectiveConfig = GMail2GDrive.Lib.getEffectiveConfig(e2e01ConfigV2)
  console.log(JSON.stringify(effectiveConfig, null, 2))
}

function e2e01Run() {
  GMail2GDrive.Lib.run(e2e01ConfigV2, "dry-run")
}
