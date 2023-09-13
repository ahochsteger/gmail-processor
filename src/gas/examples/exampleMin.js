/** @type {GmailProcessorLib.Config} */
const exampleMinConfig = {
  settings: {
    markProcessedMethod:
      GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
  },
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
