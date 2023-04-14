import { Config } from "../config/Config"
import { ThreadProcessor } from "./ThreadProcessor"
import { PatternUtil } from "../utils/PatternUtil"
import { Timer } from "../utils/Timer"
import { V1Config } from "../config/v1/V1Config"
import { V1ToV2Converter } from "../config/v1/V1ToV2Converter"
import { plainToClass } from "class-transformer"
import { EnvContext, ProcessingContext } from "../Context"
import { ActionRegistry } from "../actions/ActionRegistry"
import { GDriveAdapter } from "../adapter/GDriveAdapter"
import { GmailAdapter } from "../adapter/GmailAdapter"
import { SpreadsheetAdapter } from "../adapter/SpreadsheetAdapter"

export class GmailProcessor {
  public patternUtil: PatternUtil = new PatternUtil()
  public timer: Timer

  constructor(protected envContext: EnvContext) {
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
      config,
      dryRun,
    }
    const threadProcessor = new ThreadProcessor(processingContext) // TODO: Do not instanciate here - only once and pass different context during instanciation time and runtime!
    threadProcessor.processThreadConfigs(config.threadHandler)
    console.info("Processing of GMail2GDrive config finished.")
  }

  public runWithConfigJson(configJson: object, dryRun = false) {
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

  public runWithV1ConfigJson(v1configJson: object, dryRun = false) {
    const v1config = plainToClass(V1Config, v1configJson)
    console.log("v1config: ", v1config)
    this.runWithV1Config(v1config, dryRun)
  }

  public getEffectiveConfig(configJson: object) {
    return plainToClass(Config, configJson)
  }
}
