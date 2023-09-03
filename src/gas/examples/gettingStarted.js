/** @type {Config} */
const gettingStartedConfig = {
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
