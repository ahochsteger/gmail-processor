import EnvContext from "../../lib/Context"
import * as GmailProcessorLib from "../../lib/index"

/** @type {GmailProcessorLib.Config} */
export const gettingStartedConfig = {
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

export function gettingStartedRun(
  /** @type {EnvContext | undefined} */
  ctx,
) {
  return GmailProcessorLib.run(
    gettingStartedConfig,
    GmailProcessorLib.RunMode.DRY_RUN,
    ctx,
  )
}
