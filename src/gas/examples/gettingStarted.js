import EnvContext from "../../lib/Context"
import * as GmailProcessorLib from "../../lib/index"

/**
 * This is a getting started example configuration.
 * @type {GmailProcessorLib.Config}
 */
export const config = {
  settings: {
    // Decide on the method to be used to mark processed threads/messages:
    // MARK_MESSAGE_READ: Mark each processed messages as read (can deal with multiple messages per thread but touches the read status)
    markProcessedMethod:
      GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
    // ADD_THREAD_LABEL: Add a label (specified by markProcessedLabel) to the processed thread (unable to deal with multiple messages per thread, but doesn't touch the read status)
    // markProcessedMethod: GmailProcessorLib.MarkProcessedMethod.ADD_THREAD_LABEL,
    // markProcessedLabel: "GmailProcessor/processed",

    // Add more settings if required ...
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

export function run(
  /** @type {EnvContext | undefined} */
  ctx,
) {
  return GmailProcessorLib.run(config, GmailProcessorLib.RunMode.DRY_RUN, ctx)
}
