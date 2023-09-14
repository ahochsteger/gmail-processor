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