import { AllActions } from "./actions/AllActions"
import { Config } from "./config/Config"
import { GoogleAppsScriptContext } from "./context/GoogleAppsScriptContext"
import { ProcessingContext } from "./context/ProcessingContext"
import { GmailProcessor } from "./GmailProcessor"
import { ThreadProcessor } from "./processors/ThreadProcessor"

export function runGmailProcessorWithConfig(settings: any, rules: any[]) {
  const config = new Config(settings, rules)
  const gasContext: GoogleAppsScriptContext = new GoogleAppsScriptContext(
    GmailApp,
    DriveApp,
    console,
    Utilities,
  )
  const actionProvider = new AllActions(gasContext, config)

  const threadProcessor = new ThreadProcessor(
    GmailApp,
    actionProvider,
    new ProcessingContext(gasContext, config),
  )
  const gmailProcessor = new GmailProcessor(
    gasContext,
    config,
    actionProvider,
    threadProcessor,
  )
  gmailProcessor.run()
}
