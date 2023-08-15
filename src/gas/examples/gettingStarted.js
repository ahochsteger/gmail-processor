/* global GMail2GDrive */

var gettingStartedConfigV2 = {
  settings: {
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

function gettingStartedEffectiveConfig() {
  const effectiveConfig = GMail2GDrive.Lib.getEffectiveConfig(
    gettingStartedConfigV2,
  )
  console.log(JSON.stringify(effectiveConfig, null, 2))
}

function gettingStartedRun() {
  GMail2GDrive.Lib.run(gettingStartedConfigV2, "dry-run")
}
