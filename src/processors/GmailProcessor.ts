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
  public logger: Console
  public patternUtil: PatternUtil = new PatternUtil()
  public timer: Timer

  constructor(
    public gasContext = new GoogleAppsScriptContext(
      GmailApp,
      DriveApp,
      console,
      Utilities,
      SpreadsheetApp,
      CacheService,
    ),
  ) {
    this.timer = new Timer()
    this.logger = gasContext.logger
  }

  public setLogger(logger: Console) {
    this.logger = logger
  }

  public run(config: Config, dryRun = false) {
    this.logger.info("Processing of GMail2GDrive config started ...")
    const processingContext = new ProcessingContext(
      this.gasContext,
      config,
      dryRun,
    )
    const threadProcessor = new ThreadProcessor(processingContext)
    threadProcessor.logger = this.logger
    threadProcessor.processThreadConfigs(config.threadHandler)
    this.logger.info("Processing of GMail2GDrive config finished.")
  }

  public runWithConfigJson(configJson: object, dryRun = false) {
    const config = plainToClass(Config, configJson)
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
}
