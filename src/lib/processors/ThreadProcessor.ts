import {
  ProcessingContext,
  ProcessingResult,
  ThreadContext,
  newProcessingResult,
} from "../Context"
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
  private static buildFilter(prefix: string, value: string): string {
    return this.isSet(value, "") ? ` ${prefix}${value}` : ""
  }
  public static buildQuery(
    ctx: ProcessingContext,
    threadMatchConfig: RequiredThreadMatchConfig,
  ) {
    let gSearchExp = this.getStr(threadMatchConfig.query)
    gSearchExp += this.buildFilter(
      " -label:",
      ctx.proc.config.settings?.markProcessedMethod ===
        MarkProcessedMethod.ADD_THREAD_LABEL
        ? ctx.proc.config.settings?.markProcessedLabel
        : "",
    )
    gSearchExp += this.buildFilter(" newer_than:", threadMatchConfig.newerThan)
    return gSearchExp.trim().replace(/[ ]+/g, " ")
  }

  public static buildMatchConfig(
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

  public static processConfigs(
    ctx: ProcessingContext,
    configs: RequiredThreadConfig[],
    result: ProcessingResult = newProcessingResult(),
  ): ProcessingResult {
    for (let configIndex = 0; configIndex < configs.length; configIndex++) {
      const config = configs[configIndex]
      ctx.log.info(`Processing of thread config '${config.name}' started ...`)
      const matchConfig = this.buildMatchConfig(
        ctx.proc.config.global.thread.match,
        config.match,
      )
      const gSearchExp = this.buildQuery(ctx, matchConfig)
      // Process all threads matching the search expression:
      const threads = ctx.proc.gmailAdapter.search(
        gSearchExp,
        ctx.proc.config.settings.maxBatchSize,
      )
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
        result = this.processEntity(threadContext, result)
      }
      ctx.log.info(`Processing of thread config '${config.name}' finished.`)
    }
    return result
  }

  public static processEntity(
    ctx: ThreadContext,
    result: ProcessingResult = newProcessingResult(),
  ): ProcessingResult {
    const thread: GoogleAppsScript.Gmail.GmailThread = ctx.thread.object
    const config: RequiredThreadConfig = ctx.thread.config
    ctx.log.info(
      `Processing of thread id ${thread.getId()} (subject:'${thread.getFirstMessageSubject()}') started ...`,
    )
    // Execute pre-main actions:
    result = this.executeActions(
      ctx,
      ProcessingStage.PRE_MAIN,
      result,
      ctx.proc.config.global.thread.actions,
      ctx.thread.config.actions,
    )

    // Process message configs:
    if (config.messages) {
      result = MessageProcessor.processConfigs(ctx, config.messages, result)
    }

    // Execute post-main actions:
    result = this.executeActions(
      ctx,
      ProcessingStage.POST_MAIN,
      result,
      ctx.thread.config.actions,
      ctx.proc.config.global.thread.actions,
    )
    ctx.log.info(`Processing of thread id ${thread.getId()} finished.`)
    return result
  }
}
