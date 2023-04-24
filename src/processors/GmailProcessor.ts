import { EnvContext, ProcessingContext } from "../Context"
import { ActionRegistry } from "../actions/ActionRegistry"
import { GDriveAdapter } from "../adapter/GDriveAdapter"
import { GmailAdapter } from "../adapter/GmailAdapter"
import { SpreadsheetAdapter } from "../adapter/SpreadsheetAdapter"
import { Config, jsonToConfig, normalizeConfig } from "../config/Config"
import { V1Config, jsonToV1Config } from "../config/v1/V1Config"
import { V1ToV2Converter } from "../config/v1/V1ToV2Converter"
import { PatternUtil } from "../utils/PatternUtil"
import { Timer } from "../utils/Timer"
import { ThreadProcessor } from "./ThreadProcessor"

export class GmailProcessor {
  public patternUtil: PatternUtil = new PatternUtil()
  public timer: Timer

  constructor(protected envContext: EnvContext) {
    // TODO: Pass context on methods, not in constructor?
    this.timer = new Timer()
  }

  public run(config: Config, dryRun = false) {
    console.info("Processing of GMail2GDrive config started ...")
    const actionRegistry = new ActionRegistry()
    const processingContext: ProcessingContext = {
      ...this.envContext,
      actionRegistry: actionRegistry,
      gdriveAdapter: new GDriveAdapter(this.envContext),
      gmailAdapter: new GmailAdapter(this.envContext),
      spreadsheetAdapter: new SpreadsheetAdapter(this.envContext),
      config: normalizeConfig(config),
      dryRun,
    }
    const threadProcessor = new ThreadProcessor(processingContext) // TODO: Do not instanciate here - only once and pass different context during instanciation time and runtime!
    threadProcessor.processThreadConfigs(config.threads)
    console.info("Processing of GMail2GDrive config finished.")
  }

  public runWithConfigJson(
    configJson: Record<string, unknown>,
    dryRun = false,
  ) {
    const config = this.getEffectiveConfig(configJson)
    console.info("Effective configuration: " + JSON.stringify(config))
    this.run(config, dryRun)
  }

  public runWithV1Config(v1config: V1Config, dryRun = false) {
    const config = V1ToV2Converter.v1ConfigToV2Config(v1config)
    console.warn(
      "Using deprecated v1 config format - switching to the new v2 config format is strongly recommended!",
    )
    this.run(config, dryRun)
  }

  public runWithV1ConfigJson(
    v1configJson: Record<string, unknown>,
    dryRun = false,
  ) {
    const v1config = jsonToV1Config(v1configJson)
    console.log("v1config: ", v1config)
    this.runWithV1Config(v1config, dryRun)
  }

  public getEffectiveConfig(configJson: Record<string, unknown>) {
    return jsonToConfig(configJson)
  }
}
