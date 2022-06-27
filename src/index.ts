import { AllActions } from "./actions/AllActions"
import { Config } from "./config/Config"
import { GoogleAppsScriptContext } from "./context/GoogleAppsScriptContext"
import { ProcessingContext } from "./context/ProcessingContext"
import { GmailProcessor } from "./GmailProcessor"
import { ThreadProcessor } from "./processors/ThreadProcessor"
import "reflect-metadata"
import { plainToInstance } from "class-transformer"

export function run(jsonConfig: any) {
  const config = plainToInstance(Config, jsonConfig)
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

// TODO: Remove - is just for compatibility
export function runGmailProcessorWithConfig(settings: any, rules: any[]) {
  const config = settings
  config.threadRules = rules
  run(config)
}
