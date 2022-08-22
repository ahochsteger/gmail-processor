import { Config } from "../config/Config"
import { GoogleAppsScriptContext } from "../context/GoogleAppsScriptContext"
import { ProcessingContext } from "../context/ProcessingContext"
import { ThreadProcessor } from "./ThreadProcessor"
import { PatternUtil } from "../utils/PatternUtil"
import { Timer } from "../utils/Timer"

export class GmailProcessor {
  public logger: Console = console
  public patternUtil: PatternUtil = new PatternUtil()
  public timer: Timer

  constructor(
    public gasContext: GoogleAppsScriptContext,
    public config: Config,
    public threadProcessor: ThreadProcessor,
  ) {
    this.timer = new Timer()
  }

  public setLogger(logger: Console) {
    this.logger = logger
  }

  public run() {
    this.logger.info("Processing of GMail2GDrive config started ...")
    const processingContext = new ProcessingContext(
      this.gasContext,
      this.config,
    )
    const threadProcessor = new ThreadProcessor(
      this.gasContext.gmailApp,
      processingContext,
    )
    threadProcessor.logger = this.logger
    threadProcessor.processThreadConfigs(this.config.handler)
    this.logger.info("Processing of GMail2GDrive config finished.")
  }
}
