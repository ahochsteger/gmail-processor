import { ProcessingContext, ThreadContext } from "../Context"
import { ThreadActions } from "../actions/ThreadActions"
import { ThreadConfig } from "../config/ThreadConfig"
import { MessageProcessor } from "./MessageProcessor"

export class ThreadProcessor {
  public static processThreadConfigs(
    ctx: ProcessingContext,
    threadConfigs: ThreadConfig[],
  ) {
    for (let i = 0; i < threadConfigs.length; i++) {
      const threadConfig = threadConfigs[i]
      threadConfig.name =
        threadConfig.name !== "" ? threadConfig.name : `thread-cfg-${i + 1}`
      this.processThreadConfig(ctx, threadConfig, i)
    }
  }

  private static isSet(value: string) {
    return value !== undefined && value != null && value != ""
  }
  private static getStr(value: string, defaultVal = "") {
    return this.isSet(value) ? value : defaultVal
  }

  public static getQueryFromThreadConfig(
    ctx: ProcessingContext,
    threadConfig: ThreadConfig,
  ) {
    let gSearchExp = ""
    gSearchExp += this.getStr(ctx.config.global?.match?.query)
    gSearchExp += " " + this.getStr(threadConfig.match.query)
    gSearchExp += this.isSet(ctx.config.settings?.processedLabel)
      ? " -label:" + ctx.config.settings.processedLabel
      : ""
    gSearchExp += this.isSet(ctx.config.global?.match?.newerThan)
      ? " newer_than:" + ctx.config.global.match.newerThan
      : ""
    return gSearchExp.trim()
  }

  public static processThreadConfig(
    ctx: ProcessingContext,
    threadConfig: ThreadConfig,
    threadConfigIndex: number,
  ) {
    const gSearchExp = this.getQueryFromThreadConfig(ctx, threadConfig)
    // Process all threads matching the search expression:
    const threads = ctx.gmailAdapter.search(
      gSearchExp,
      ctx.config.settings.maxBatchSize,
    )
    console.info(
      `  Processing of thread config '${threadConfig.name}' started ...`,
    )
    for (let threadIndex = 0; threadIndex < threads.length; threadIndex++) {
      const thread = threads[threadIndex]
      const runTime = ctx.timer.getRunTime()
      if (runTime >= ctx.config.settings.maxRuntime) {
        // TODO: Simplify/refactor timer handling (->Base class?)
        console.warn(
          `Processing terminated due to reaching runtime of ${runTime}s (max:${ctx.config.settings.maxRuntime}s).`,
        )
        return
      }
      const threadContext: ThreadContext = {
        ...ctx,
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

  public static processThread(threadContext: ThreadContext) {
    // TODO: Check, if this.processingContext would be better here!
    const thread: GoogleAppsScript.Gmail.GmailThread = threadContext.thread
    const threadConfig: ThreadConfig = threadContext.threadConfig
    console.info(
      `    Processing of thread '${thread.getFirstMessageSubject()}' started ...`,
    )
    MessageProcessor.processMessageConfigs(threadContext, threadConfig.messages)
    // // Process all messages of a thread:
    // for (const messageRule of threadRule.messageRules) {
    //     for (const message of thread.getMessages()) {
    //         const messageContext = new MessageContext(
    //             messageRule, message, thread.getMessages().indexOf(message))
    //         messageProcessor.processMessage(message)
    //     }
    // }

    // Mark a thread as processed:
    ThreadActions.markProcessed(threadContext)
    console.info(
      `    Processing of thread '${thread.getFirstMessageSubject()}' finished.`,
    )
  }
}
