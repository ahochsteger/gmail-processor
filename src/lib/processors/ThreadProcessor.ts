import {
  MetaInfoType as MIT,
  MetaInfo,
  ProcessingContext,
  ProcessingResult,
  ThreadContext,
  ThreadInfo,
  newMetaInfo as mi,
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
import { PatternUtil } from "../utils/PatternUtil"
import { BaseProcessor } from "./BaseProcessor"
import { MessageProcessor } from "./MessageProcessor"

export class ThreadProcessor extends BaseProcessor {
  public static buildContext(
    ctx: ProcessingContext,
    info: ThreadInfo,
  ): ThreadContext {
    const threadContext: ThreadContext = {
      ...ctx,
      thread: info,
      threadMeta: {},
    }
    threadContext.threadMeta = this.buildMetaInfo(threadContext)
    threadContext.meta = {
      ...threadContext.procMeta,
      ...threadContext.threadMeta,
    }
    return threadContext
  }
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

  public static buildMetaInfo(ctx: ThreadContext): MetaInfo {
    const thread = ctx.thread.object
    const m = {
      "thread.firstMessageSubject": mi(
        MIT.STRING,
        thread.getFirstMessageSubject(),
        this.getRefDocs("thread", "getFirstMessageSubject"),
      ),
      "thread.hasStarredMessages": mi(
        MIT.BOOLEAN,
        thread.hasStarredMessages(),
        this.getRefDocs("thread", "hasStarredMessages"),
      ),
      "thread.id": mi(
        MIT.STRING,
        thread.getId(),
        this.getRefDocs("thread", "getId"),
      ),
      "thread.isImportant": mi(
        MIT.STRING,
        thread.isImportant(),
        this.getRefDocs("thread", "isImportant"),
      ),
      "thread.isInChats": mi(
        MIT.STRING,
        thread.isInChats(),
        this.getRefDocs("thread", "isInChats"),
      ),
      "thread.isInInbox": mi(
        MIT.STRING,
        thread.isInInbox(),
        this.getRefDocs("thread", "isInInbox"),
      ),
      "thread.isInPriorityInbox": mi(
        MIT.STRING,
        thread.isInPriorityInbox(),
        this.getRefDocs("thread", "isInPriorityInbox"),
      ),
      "thread.isInSpam": mi(
        MIT.STRING,
        thread.isInSpam(),
        this.getRefDocs("thread", "isInSpam"),
      ),
      "thread.isInTrash": mi(
        MIT.STRING,
        thread.isInTrash(),
        this.getRefDocs("thread", "isInTrash"),
      ),
      "thread.isUnread": mi(
        MIT.STRING,
        thread.isUnread(),
        this.getRefDocs("thread", "isUnread"),
      ),
      "thread.labels": mi(
        MIT.STRING,
        thread.getLabels().map((l) => l.getName()),
        this.getRefDocs("thread", "getLabels"),
      ),
      "thread.lastMessageDate": mi(
        MIT.DATE,
        thread.getLastMessageDate(),
        this.getRefDocs("thread", "getLastMessageDate"),
      ),
      "thread.messageCount": mi(
        MIT.NUMBER,
        thread.getMessageCount(),
        this.getRefDocs("thread", "getMessageCount"),
      ),
      "thread.permalink": mi(
        MIT.STRING,
        thread.getPermalink(),
        this.getRefDocs("thread", "getPermalink"),
      ),
      "thread.index": mi(
        MIT.NUMBER,
        ctx.thread.index,
        "The index number (0-based) of the processed thread.",
      ),
      "threadConfig.index": mi(
        MIT.NUMBER,
        ctx.thread.configIndex,
        "The index number (0-based) of the processed thead config.",
      ),
    }
    return m
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
      const query = PatternUtil.substitute(
        ctx,
        this.buildQuery(ctx, matchConfig),
      )
      ctx.log.info(`GMail search query: ${query}`)
      // Process all threads matching the search expression:
      const threads = ctx.proc.gmailAdapter.search(
        query,
        ctx.proc.config.settings.maxBatchSize,
      )
      for (let threadIndex = 0; threadIndex < threads.length; threadIndex++) {
        const thread = threads[threadIndex]
        ctx.proc.timer.checkMaxRuntimeReached()
        const threadContext = this.buildContext(ctx, {
          object: thread,
          config: config,
          configIndex: configIndex,
          index: threadIndex,
        })
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
