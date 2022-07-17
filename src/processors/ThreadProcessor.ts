import { ActionProvider } from "../actions/ActionProvider"
import { Actions } from "../actions/Actions"
import { Config } from "../config/Config"
import { GmailActions } from "../actions/GmailActions"
import { MessageProcessor } from "./MessageProcessor"
import { ProcessingContext } from "../context/ProcessingContext"
import { ThreadConfig } from "../config/ThreadConfig"
import { ThreadContext } from "../context/ThreadContext"
import { Timer } from "../utils/Timer"

export class ThreadProcessor {
  public logger: Console = console
  public data: any
  public type = "thread"
  public timer: Timer
  public actions: Actions
  public config: Config
  public gmailActions: GmailActions

  constructor(
    public gmailApp: GoogleAppsScript.Gmail.GmailApp,
    public actionProvider: ActionProvider,
    public processingContext: ProcessingContext,
  ) {
    this.timer = new Timer()
    this.actions = actionProvider.getActions()
    this.config = processingContext.config
    this.gmailActions = new GmailActions(gmailApp)
  }

  public processThreadRules(threadRules: ThreadConfig[]) {
    for (const threadRule of threadRules) {
      this.processThreadRule(threadRule)
    }
  }

  public processThreadRule(threadConfig: ThreadConfig) {
    let gSearchExp =
      (this.config.global.match.query) +
      " " +
      (threadConfig.match.query) +
      " -label:" +
      this.config.settings.processedLabel
    if (this.config.global.match.newerThan != "") {
      gSearchExp += " newer_than:" + this.config.global.match.newerThan
    }
    // Process all threads matching the search expression:
    const threads = this.gmailApp.search(
      gSearchExp,
      1,
      this.config.settings.maxBatchSize,
    )
    this.logger.info("  Processing rule: " + gSearchExp)
    for (const thread of threads) {
      const runTime = this.timer.getRunTime()
      if (runTime >= this.config.settings.maxRuntime) {
        this.logger.warn(
          "Self terminating script after max runtime " + runTime + "s",
        )
        return
      }
      this.logger.info(
        "    Processing thread: " +
          thread.getFirstMessageSubject() +
          " (runtime: " +
          runTime +
          "s/" +
          this.config.settings.maxRuntime +
          "s)",
      )
      const threadContext: ThreadContext = new ThreadContext(
        threadConfig,
        thread,
        threads.indexOf(thread),
        (this.config.handler).indexOf(threadConfig),
      )
      this.processingContext.threadContext = threadContext
      this.processThread(threadContext)
    }
  }

  public processThread(threadContext: ThreadContext) {
    const thread: GoogleAppsScript.Gmail.GmailThread = threadContext.thread
    const threadRule: ThreadConfig = threadContext.threadConfig
    const messageProcessor = new MessageProcessor(
      this.gmailApp,
      this.actionProvider,
      this.processingContext,
    )
    messageProcessor.processMessageRules(threadRule.handler)
    // // Process all messages of a thread:
    // for (const messageRule of threadRule.messageRules) {
    //     for (const message of thread.getMessages()) {
    //         const messageContext = new MessageContext(
    //             messageRule, message, thread.getMessages().indexOf(message))
    //         messageProcessor.processMessage(message)
    //     }
    // }

    // Mark a thread as processed:
    this.markThreadAsProcessed(thread)
  }

  /**
   * Mark a thread as processed.
   * @param thread The thread to mark as processed.
   * @param config The global configuration.
   */
  public markThreadAsProcessed(thread: GoogleAppsScript.Gmail.GmailThread) {
    if (this.config.settings.processedLabel != "") {
      const label = this.gmailActions.getOrCreateLabel(this.config.settings.processedLabel)
      thread.addLabel(label)
    }
  }
}
