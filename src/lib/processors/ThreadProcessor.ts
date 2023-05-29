import { ProcessingContext, ProcessingResult, ThreadContext } from "../Context"
import { ProcessingStage } from "../config/ActionConfig"
import { MarkProcessedMethod } from "../config/SettingsConfig"
import { RequiredThreadConfig } from "../config/ThreadConfig"
import {
  RequiredThreadMatchConfig,
  ThreadMatchConfig,
  newThreadMatchConfig,
} from "../config/ThreadMatchConfig"
import { BaseProcessor } from "./BaseProcessor"
import { MessageProcessor } from "./MessageProcessor"

export class ThreadProcessor extends BaseProcessor {
  public static processConfigs(
    ctx: ProcessingContext,
    configs: RequiredThreadConfig[],
  ) {
    for (let i = 0; i < configs.length; i++) {
      const config = configs[i]
      config.name = config.name !== "" ? config.name : `thread-cfg-${i + 1}`
      this.processConfig(ctx, config, i)
    }
    const result: ProcessingResult = {
      status: "ok",
      performedActions: [],
    }
    return result
  }

  private static getFilter(prefix: string, value: string): string {
    return this.isSet(value, "") ? ` ${prefix}${value}` : ""
  }
  public static buildQuery(
    ctx: ProcessingContext,
    threadMatchConfig: RequiredThreadMatchConfig,
  ) {
    let gSearchExp = this.getStr(threadMatchConfig.query)
    gSearchExp += this.getFilter(
      " -label:",
      ctx.proc.config.settings?.markProcessedMethod ===
        MarkProcessedMethod.ADD_THREAD_LABEL
        ? ctx.proc.config.settings?.markProcessedLabel
        : "",
    )
    gSearchExp += this.getFilter(" newer_than:", threadMatchConfig.newerThan)
    return gSearchExp.trim().replace(/[ ]+/g, " ")
  }

  public static getEffectiveMatchConfig(
    global: ThreadMatchConfig,
    local: RequiredThreadMatchConfig,
  ): RequiredThreadMatchConfig {
    return newThreadMatchConfig({
      query: `${global.query} ${local.query}`,
      maxMessageCount: this.effectiveNumber(
        global.maxMessageCount,
        local.maxMessageCount,
        -1,
      ),
      minMessageCount: this.effectiveNumber(
        global.minMessageCount,
        local.minMessageCount,
        -1,
      ),
      newerThan: this.isSet(local.newerThan)
        ? local.newerThan
        : global.newerThan,
    })
  }
  public static processConfig(
    ctx: ProcessingContext,
    config: RequiredThreadConfig,
    configIndex: number,
  ) {
    const effectiveThreadMatchConfig = this.getEffectiveMatchConfig(
      ctx.proc.config.global.thread.match,
      config.match,
    )
    const gSearchExp = this.buildQuery(ctx, effectiveThreadMatchConfig)
    // Process all threads matching the search expression:
    const threads = ctx.proc.gmailAdapter.search(
      gSearchExp,
      ctx.proc.config.settings.maxBatchSize,
    )
    ctx.log.info(`  Processing of thread config '${config.name}' started ...`)
    for (let threadIndex = 0; threadIndex < threads.length; threadIndex++) {
      const thread = threads[threadIndex]
      ctx.proc.timer.checkMaxRuntimeReached()
      const threadContext: ThreadContext = {
        ...ctx,
        thread: {
          object: thread,
          config: config,
          configIndex: configIndex,
          index: threadIndex,
        },
      }
      this.processThread(threadContext)
    }
    ctx.log.info(`  Processing of thread config '${config.name}' finished.`)
  }

  public static processThread(ctx: ThreadContext) {
    const thread: GoogleAppsScript.Gmail.GmailThread = ctx.thread.object
    const config: RequiredThreadConfig = ctx.thread.config
    ctx.log.info(
      `    Processing of thread '${thread.getFirstMessageSubject()}' started ...`,
    )
    // Execute pre-main actions:
    this.executeActions(
      ctx,
      ProcessingStage.PRE_MAIN,
      ctx.proc.config.global.thread.actions,
      ctx.thread.config.actions,
    )

    // Process message configs:
    if (config.messages) {
      MessageProcessor.processConfigs(ctx, config.messages)
    }

    // Execute post-main actions:
    this.executeActions(
      ctx,
      ProcessingStage.POST_MAIN,
      ctx.thread.config.actions,
      ctx.proc.config.global.thread.actions,
    )
    ctx.log.info(
      `    Processing of thread '${thread.getFirstMessageSubject()}' finished.`,
    )
  }
}
