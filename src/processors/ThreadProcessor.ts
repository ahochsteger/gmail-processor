import { Config } from "../config/Config"
import { BaseProcessor } from "./BaseProcessor"
import { MessageProcessor } from "./MessageProcessor"
import { ThreadConfig } from "../config/ThreadConfig"
import { Timer } from "../utils/Timer"
import { ProcessingContext, ThreadContext } from "../Context"
import { ThreadActions } from "../actions/ThreadActions"

export class ThreadProcessor extends BaseProcessor {
  public type = "thread"
  public timer: Timer
  public config: Config

  constructor(protected processingContext: ProcessingContext) {
    super()
    this.timer = new Timer()
    this.config = processingContext.config
  }

  public processThreadConfigs(threadConfigs: ThreadConfig[]) {
    for (let i = 0; i < threadConfigs.length; i++) {
      const threadConfig = threadConfigs[i]
      threadConfig.name =
        threadConfig.name !== "" ? threadConfig.name : `thread-cfg-${i + 1}`
      this.processThreadConfig(threadConfig, i)
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

  public processThreadConfig(
    threadConfig: ThreadConfig,
    threadConfigIndex: number,
  ) {
    const gSearchExp = this.getQueryFromThreadConfig(threadConfig)
    // Process all threads matching the search expression:
    const threads = this.processingContext.gmailAdapter.search(
      gSearchExp,
      this.config.settings.maxBatchSize,
    )
    console.info(
      `  Processing of thread config '${threadConfig.name}' started ...`,
    )
    for (let threadIndex = 0; threadIndex < threads.length; threadIndex++) {
      const thread = threads[threadIndex]
      const runTime = this.timer.getRunTime()
      if (runTime >= this.config.settings.maxRuntime) {
        // TODO: Simplify/refactor timer handling (->Base class?)
        console.warn(
          `Processing terminated due to reaching runtime of ${runTime}s (max:${this.config.settings.maxRuntime}s).`,
        )
        return
      }
      const threadContext: ThreadContext = {
        ...this.processingContext,
        thread,
        threadActions: new ThreadActions(), // TODO: Move to processing context?
        threadConfig,
        threadConfigIndex,
        threadIndex,
      }
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
    const messageProcessor = new MessageProcessor(threadContext) // TODO: Do not instanciate here - only once and pass different context during instanciation time and runtime!
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
    threadContext.threadActions.markProcessed(threadContext)
    console.info(
      `    Processing of thread '${thread.getFirstMessageSubject()}' finished.`,
    )
  }
}
