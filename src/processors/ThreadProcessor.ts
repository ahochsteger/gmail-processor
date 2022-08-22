import { Config } from "../config/Config"
import { MessageProcessor } from "./MessageProcessor"
import { ProcessingContext } from "../context/ProcessingContext"
import { ThreadConfig } from "../config/ThreadConfig"
import { ThreadContext } from "../context/ThreadContext"
import { Timer } from "../utils/Timer"
import { ThreadActions } from "../actions/ThreadActions"

export class ThreadProcessor {
  public logger: Console = console
  public type = "thread"
  public timer: Timer
  public config: Config

  constructor(
    public gmailApp: GoogleAppsScript.Gmail.GmailApp,
    public processingContext: ProcessingContext,
  ) {
    this.timer = new Timer()
    this.config = processingContext.config
  }

  public processThreadRules(threadRules: ThreadConfig[]) {
    for (let i = 0; i < threadRules.length; i++) {
      const threadRule = threadRules[i]
      threadRule.description =
        threadRule.description !== ""
          ? threadRule.description
          : `Thread config #${i + 1}`
      this.processThreadRule(threadRule)
    }
  }

  public getQueryFromThreadConfig(threadConfig: ThreadConfig) {
    let gSearchExp = ""
    gSearchExp +=
      this.config.global.match.query != "" ? this.config.global.match.query : ""
    gSearchExp +=
      threadConfig.match.query != "" ? " " + threadConfig.match.query : ""
    gSearchExp +=
      this.config.settings.processedLabel != ""
        ? " -label:" + this.config.settings.processedLabel
        : ""
    gSearchExp +=
      this.config.global.match.newerThan != ""
        ? " newer_than:" + this.config.global.match.newerThan
        : ""
    return gSearchExp.trim()
  }

  public processThreadRule(threadConfig: ThreadConfig) {
    const gSearchExp = this.getQueryFromThreadConfig(threadConfig)
    // Process all threads matching the search expression:
    const threads = this.gmailApp.search(
      gSearchExp,
      1,
      this.config.settings.maxBatchSize,
    )
    this.logger.info(
      `  Processing of thread config '${threadConfig.description}' started ...`,
    )
    for (const thread of threads) {
      const runTime = this.timer.getRunTime()
      if (runTime >= this.config.settings.maxRuntime) {
        this.logger.warn(
          `Processing terminated due to reaching runtime of ${runTime}s (max:${this.config.settings.maxRuntime}s).`,
        )
        return
      }
      const threadContext: ThreadContext = new ThreadContext(
        threadConfig,
        thread,
        threads.indexOf(thread),
        this.config.handler.indexOf(threadConfig),
      )
      this.processingContext.threadContext = threadContext
      this.processThread(threadContext)
    }
    this.logger.info(
      `  Processing of thread config '${threadConfig.description}' finished.`,
    )
  }

  public processThread(threadContext: ThreadContext) {
    // TODO: Check, if this.processingContext would be better here!
    const thread: GoogleAppsScript.Gmail.GmailThread = threadContext.thread
    const threadRule: ThreadConfig = threadContext.threadConfig
    const threadActions = new ThreadActions(
      this.processingContext,
      this.logger,
      this.config.settings.dryRun,
      thread,
    )
    const messageProcessor = new MessageProcessor(
      this.gmailApp,
      this.processingContext,
    )
    this.logger.info(
      `    Processing of thread '${thread.getFirstMessageSubject()}' started ...`,
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
    threadActions.markAsProcessed()
    this.logger.info(
      `    Processing of thread '${thread.getFirstMessageSubject()}' finished.`,
    )
  }
}
