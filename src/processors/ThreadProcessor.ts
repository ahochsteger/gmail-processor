import { Config } from "../config/Config"
import { BaseProcessor } from "./BaseProcessor"
import { MessageProcessor } from "./MessageProcessor"
import { ProcessingContext } from "../context/ProcessingContext"
import { ThreadConfig } from "../config/ThreadConfig"
import { ThreadContext } from "../context/ThreadContext"
import { Timer } from "../utils/Timer"
import { ThreadActions } from "../actions/ThreadActions"

export class ThreadProcessor extends BaseProcessor {
  public type = "thread"
  public timer: Timer
  public config: Config

  constructor(public processingContext: ProcessingContext) {
    super()
    this.timer = new Timer()
    this.config = processingContext.config
  }

  public processThreadConfigs(threadConfigs: ThreadConfig[]) {
    for (let i = 0; i < threadConfigs.length; i++) {
      const threadConfig = threadConfigs[i]
      threadConfig.name =
        threadConfig.name !== "" ? threadConfig.name : `thread-cfg-${i + 1}`
      this.processThreadConfig(threadConfig)
    }
  }

  public getQueryFromThreadConfig(threadConfig: ThreadConfig) {
    let gSearchExp = ""
    gSearchExp += this.getStr(this.config.global?.match?.query)
    gSearchExp += " " + this.getStr(threadConfig.match.query)
    gSearchExp += this.isSet(this.config.settings?.processedLabel)
      ? " -label:" + this.config.settings.processedLabel
      : ""
    gSearchExp += this.isSet(this.config.global?.match?.newerThan)
      ? " newer_than:" + this.config.global.match.newerThan
      : ""
    return gSearchExp.trim()
  }

  public processThreadConfig(threadConfig: ThreadConfig) {
    const gSearchExp = this.getQueryFromThreadConfig(threadConfig)
    // Process all threads matching the search expression:
    const threads = this.processingContext.gmailAdapter.search(gSearchExp)
    console.info(
      `  Processing of thread config '${threadConfig.name}' started ...`,
    )
    for (const thread of threads) {
      const runTime = this.timer.getRunTime()
      if (runTime >= this.config.settings.maxRuntime) {
        console.warn(
          `Processing terminated due to reaching runtime of ${runTime}s (max:${this.config.settings.maxRuntime}s).`,
        )
        return
      }
      const threadContext: ThreadContext = new ThreadContext(
        this.processingContext,
        threadConfig,
        thread,
      )
      this.processThread(threadContext)
    }
    console.info(
      `  Processing of thread config '${threadConfig.name}' finished.`,
    )
  }

  public processThread(threadContext: ThreadContext) {
    // TODO: Check, if this.processingContext would be better here!
    const thread: GoogleAppsScript.Gmail.GmailThread = threadContext.thread
    const threadConfig: ThreadConfig = threadContext.threadConfig
    const threadActions = new ThreadActions(threadContext)
    const messageProcessor = new MessageProcessor(threadContext)
    console.info(
      `    Processing of thread '${thread.getFirstMessageSubject()}' started ...`,
    )
    messageProcessor.processMessageConfigs(threadConfig.messageHandler)
    // // Process all messages of a thread:
    // for (const messageRule of threadRule.messageRules) {
    //     for (const message of thread.getMessages()) {
    //         const messageContext = new MessageContext(
    //             messageRule, message, thread.getMessages().indexOf(message))
    //         messageProcessor.processMessage(message)
    //     }
    // }

    // Mark a thread as processed:
    threadActions.markProcessed()
    console.info(
      `    Processing of thread '${thread.getFirstMessageSubject()}' finished.`,
    )
  }
}
