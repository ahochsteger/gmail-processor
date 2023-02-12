import { Config } from "../config/Config"
import { GoogleAppsScriptContext } from "../context/GoogleAppsScriptContext"
import { ProcessingContext } from "../context/ProcessingContext"
import { ThreadProcessor } from "./ThreadProcessor"
import { PatternUtil } from "../utils/PatternUtil"
import { Timer } from "../utils/Timer"
import { V1Config } from "../config/v1/V1Config"
import { V1ToV2Converter } from "../config/v1/V1ToV2Converter"
import { plainToClass } from "class-transformer"

export class GmailProcessor {
  public patternUtil: PatternUtil = new PatternUtil()
  public timer: Timer

  constructor(
    public gasContext = new GoogleAppsScriptContext(
      GmailApp,
      DriveApp,
      Utilities,
      SpreadsheetApp,
      CacheService,
    ),
  ) {
    this.timer = new Timer()
  }

  public run(config: Config, dryRun = false) {
    console.info("Processing of GMail2GDrive config started ...")
    const processingContext = new ProcessingContext(
      this.gasContext,
      config,
      dryRun,
    )
    const threadProcessor = new ThreadProcessor(processingContext)
    threadProcessor.processThreadConfigs(config.threadHandler)
    console.info("Processing of GMail2GDrive config finished.")
  }

  public runWithConfigJson(configJson: object, dryRun = false) {
    const config = this.getEffectiveConfig(configJson)
    console.info("Effective configuration: " + JSON.stringify(config))
    const gmailProcessor = new GmailProcessor()
    gmailProcessor.run(config, dryRun)
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
    this.runWithV1Config(v1config, dryRun)
  }

  public getEffectiveConfig(configJson: object) {
    return plainToClass(Config, configJson)
  }
}
