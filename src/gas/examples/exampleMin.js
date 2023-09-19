import EnvContext from "../../lib/Context"
import * as GmailProcessorLib from "../../lib/index"

/**
 * This is a minimal configuration example, just with the required information.
 * It just processes files without doing anything, but they will still be marked as processed!
 * It can be used if you want to start your config from scratch.
 * @type {GmailProcessorLib.Config}
 */
export const exampleMinConfig = {
  settings: {
    // Chose a method to mark processed entities:
    markProcessedMethod:
      GmailProcessorLib.MarkProcessedMethod.MARK_MESSAGE_READ,
  },
  threads: [
    {
      // Put thread config here.
    },
  ],
}

/**
 * Run Gmail Processor with config
 * @param {GoogleAppsScript.Events.TimeDriven | undefined} evt Event information
 * @param {EnvContext | undefined} ctx Environment context
 * @returns {GmailProcessorLib.ProcessingResult} Processing result
 */
export function exampleMinRun(_evt, ctx) {
  return GmailProcessorLib.run(
    exampleMinConfig,
    GmailProcessorLib.RunMode.DRY_RUN,
    ctx,
  )
}
