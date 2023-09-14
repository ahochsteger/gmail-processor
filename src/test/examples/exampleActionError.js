import EnvContext from "../../lib/Context"
import * as GmailProcessorLib from "../../lib/index"

/**
 * This is an example to immediately cancel processing for special use cases.
 * It is used for testing the error handling of actions.
 * @type {GmailProcessorLib.Config}
 */
export const exampleActionErrorConfig = {
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

export function exampleActionErrorRun(
  /** @type {EnvContext | undefined} */
  ctx,
) {
  return GmailProcessorLib.run(
    exampleActionErrorConfig,
    GmailProcessorLib.RunMode.DRY_RUN,
    ctx,
  )
}
