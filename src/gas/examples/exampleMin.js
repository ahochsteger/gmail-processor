/** @type {GmailProcessorLib.Config} */
const exampleMinConfig = {
  threads: [{}],
}

function exampleMinRun(
  /** @type {EnvContext | undefined} */
  ctx,
) {
  return GmailProcessorLib.run(
    exampleMinConfig,
    GmailProcessorLib.RunMode.DRY_RUN,
    ctx,
  )
}
