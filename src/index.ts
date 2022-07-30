import { AllActions } from "./actions/AllActions"
import { Config } from "./config/Config"
import { GmailProcessor } from "./processors/GmailProcessor"
import { GoogleAppsScriptContext } from "./context/GoogleAppsScriptContext"
import { ProcessingContext } from "./context/ProcessingContext"
import { ThreadProcessor } from "./processors/ThreadProcessor"
import { V1Config } from "./config/v1/V1Config"
import { V1ToV2Converter } from "./config/v1/V1ToV2Converter"
import "reflect-metadata"
import { plainToClass } from "class-transformer"

export function run(config: Config) {
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

export function runWithV1Config(v1configJson: any) {
  const configV1 = plainToClass(V1Config, v1configJson)
  const config = V1ToV2Converter.v1ConfigToV2Config(configV1)
  console.warn(
    "Using deprecated v1 config format - switching to the new v2 config format is strongly recommended! Use instead:",
  )
  console.warn("Lib.run(" + JSON.stringify(config, undefined, 2) + ")")
  run(config)
}
