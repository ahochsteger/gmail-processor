import { ProcessingContext, ProcessingResult, ThreadContext } from "../Context"
import { ThreadActions } from "../actions/ThreadActions"
import { RequiredThreadConfig } from "../config/ThreadConfig"
import { MessageProcessor } from "./MessageProcessor"

export class ThreadProcessor {
  public static processThreadConfigs(
    ctx: ProcessingContext,
    threadConfigs: RequiredThreadConfig[],
  ) {
    for (let i = 0; i < threadConfigs.length; i++) {
      const threadConfig = threadConfigs[i]
      threadConfig.name =
        threadConfig.name !== "" ? threadConfig.name : `thread-cfg-${i + 1}`
      this.processThreadConfig(ctx, threadConfig, i)
    }
    const result: ProcessingResult = {
      status: "ok",
      performedActions: [],
    }
    return result
  }

  private static isSet(value: string | undefined) {
    return value !== undefined && value != null && value != ""
  }
  private static getStr(value: string, defaultVal = "") {
    return this.isSet(value) ? value : defaultVal
  }

  public static getQueryFromThreadConfig(
    ctx: ProcessingContext,
    threadConfig: RequiredThreadConfig,
  ) {
    let gSearchExp = ""
    gSearchExp += this.getStr(ctx.proc.config.global?.match?.query)
    gSearchExp += " " + this.getStr(threadConfig.match.query)
    gSearchExp += this.isSet(ctx.proc.config.settings?.processedLabel)
      ? " -label:" + ctx.proc.config.settings.processedLabel
      : ""
    gSearchExp += this.isSet(ctx.proc.config.global?.match?.newerThan)
      ? " newer_than:" + ctx.proc.config.global.match.newerThan
      : ""
    return gSearchExp.trim()
  }

  public static processThreadConfig(
    ctx: ProcessingContext,
    threadConfig: RequiredThreadConfig,
    threadConfigIndex: number,
  ) {
    const gSearchExp = this.getQueryFromThreadConfig(ctx, threadConfig)
    // Process all threads matching the search expression:
    const threads = ctx.proc.gmailAdapter.search(
      gSearchExp,
      ctx.proc.config.settings.maxBatchSize,
    )
    ctx.log.info(
      `  Processing of thread config '${threadConfig.name}' started ...`,
    )
    for (let threadIndex = 0; threadIndex < threads.length; threadIndex++) {
      const thread = threads[threadIndex]
      ctx.proc.timer.checkMaxRuntimeReached()
      const threadContext: ThreadContext = {
        ...ctx,
        thread: {
          object: thread,
          config: threadConfig,
          configIndex: threadConfigIndex,
          index: threadIndex,
        },
      }
      this.processThread(threadContext)
    }
    ctx.log.info(
      `  Processing of thread config '${threadConfig.name}' finished.`,
    )
  }

  public static processThread(ctx: ThreadContext) {
    const thread: GoogleAppsScript.Gmail.GmailThread = ctx.thread.object
    const threadConfig: RequiredThreadConfig = ctx.thread.config
    ctx.log.info(
      `    Processing of thread '${thread.getFirstMessageSubject()}' started ...`,
    )
    MessageProcessor.processMessageConfigs(ctx, threadConfig.messages)
    // // Process all messages of a thread:
    // for (const messageRule of threadRule.messageRules) {
    //     for (const message of thread.getMessages()) {
    //         const messageContext = new MessageContext(
    //             messageRule, message, thread.getMessages().indexOf(message))
    //         messageProcessor.processMessage(message)
    //     }
    // }

    // Mark a thread as processed:
    ThreadActions.markProcessed(ctx)
    ctx.log.info(
      `    Processing of thread '${thread.getFirstMessageSubject()}' finished.`,
    )
  }
}
