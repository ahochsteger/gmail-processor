import EnvContext from "../../lib/Context"
import * as GmailProcessorLib from "../../lib/index"

/** @type {GmailProcessorLib.Config} */
export const exampleMinConfig = {
  settings: {
    markProcessedMethod:
      GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
  },
  threads: [{}],
}

export function exampleMinRun(
  /** @type {EnvContext | undefined} */
  ctx,
) {
  return GmailProcessorLib.run(
    exampleMinConfig,
    GmailProcessorLib.RunMode.DRY_RUN,
    ctx,
  )
}
