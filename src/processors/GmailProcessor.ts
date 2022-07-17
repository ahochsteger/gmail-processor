import { ActionProvider } from "../actions/ActionProvider"
import { Actions } from "../actions/Actions"
import { Config } from "../config/Config"
import { GoogleAppsScriptContext } from "../context/GoogleAppsScriptContext"
import { ProcessingContext } from "../context/ProcessingContext"
import { ThreadProcessor } from "./ThreadProcessor"
import { PatternUtil } from "../utils/PatternUtil"
import { Timer } from "../utils/Timer"

export class GmailProcessor {
  public logger: Console = console
  public patternUtil: PatternUtil = new PatternUtil()
  public actions: Actions
  public timer: Timer

  constructor(
    public gasContext: GoogleAppsScriptContext,
    public config: Config,
    public actionProvider: ActionProvider,
    public threadProcessor: ThreadProcessor,
  ) {
    this.timer = new Timer()
    this.actions = actionProvider.getActions()
  }

  public setLogger(logger: Console) {
    this.logger = logger
  }

  public run() {
    const processingContext = new ProcessingContext(
      this.gasContext,
      this.config,
    )
    const threadProcessor = new ThreadProcessor(
      this.gasContext.gmailApp,
      this.actionProvider,
      processingContext,
    )
    threadProcessor.logger = this.logger
    threadProcessor.processThreadRules(this.config.handler)
  }
}
