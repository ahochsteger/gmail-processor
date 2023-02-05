import { Config } from "../config/Config"
import { GoogleAppsScriptContext } from "../context/GoogleAppsScriptContext"
import { ProcessingContext } from "../context/ProcessingContext"
import { ThreadProcessor } from "./ThreadProcessor"
import { PatternUtil } from "../utils/PatternUtil"
import { Timer } from "../utils/Timer"

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
    threadProcessor.processThreadConfigs(config.handler)
    this.logger.info("Processing of GMail2GDrive config finished.")
  }
}
