import * as GmailProcessorLib from "../../lib/index"

/** @type {Config} */
export const exampleMinConfig = {
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
