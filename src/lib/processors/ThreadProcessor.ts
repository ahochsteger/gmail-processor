import {
  ContextType,
  MetaInfoType as MIT,
  MetaInfo,
  ProcessingContext,
  ProcessingResult,
  Thread,
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
      type: ContextType.THREAD,
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
    const m = {
      "thread.firstMessageSubject": mi(
        MIT.STRING,
        (t: Thread) => t.getFirstMessageSubject(),
        this.getRefDocs(
          "thread",
          "getFirstMessageSubject",
          "The subject of the first message in the thread.",
        ),
      ),
      "thread.hasStarredMessages": mi(
        MIT.BOOLEAN,
        (t: Thread) => t.hasStarredMessages(),
        this.getRefDocs(
          "thread",
          "hasStarredMessages",
          "`true` if the thread has any starred messages.",
        ),
      ),
      "thread.id": mi(
        MIT.STRING,
        (t: Thread) => t.getId(),
        this.getRefDocs("thread", "getId", "The ID of the thread."),
      ),
      "thread.isImportant": mi(
        MIT.STRING,
        (t: Thread) => t.isImportant(),
        this.getRefDocs(
          "thread",
          "isImportant",
          "`true` if the thread is marked as important.",
        ),
      ),
      "thread.isInChats": mi(
        MIT.STRING,
        (t: Thread) => t.isInChats(),
        this.getRefDocs(
          "thread",
          "isInChats",
          "`true` if the thread is labeled a chat.",
        ),
      ),
      "thread.isInInbox": mi(
        MIT.STRING,
        (t: Thread) => t.isInInbox(),
        this.getRefDocs(
          "thread",
          "isInInbox",
          "`true` if the thread is in the inbox.",
        ),
      ),
      "thread.isInPriorityInbox": mi(
        MIT.STRING,
        (t: Thread) => t.isInPriorityInbox(),
        this.getRefDocs(
          "thread",
          "isInPriorityInbox",
          "`true` if the thread is in the priority inbox.",
        ),
      ),
      "thread.isInSpam": mi(
        MIT.STRING,
        (t: Thread) => t.isInSpam(),
        this.getRefDocs(
          "thread",
          "isInSpam",
          "`true` if the thread is marked as spam.",
        ),
      ),
      "thread.isInTrash": mi(
        MIT.STRING,
        (t: Thread) => t.isInTrash(),
        this.getRefDocs(
          "thread",
          "isInTrash",
          "`true` if the thread is marked as spam.",
        ),
      ),
      "thread.isUnread": mi(
        MIT.STRING,
        (t: Thread) => t.isUnread(),
        this.getRefDocs(
          "thread",
          "isUnread",
          "`true` if the thread has any unread messages.",
        ),
      ),
      "thread.labels": mi(
        MIT.STRING,
        (t: Thread) => t.getLabels().map((l) => l.getName()),
        this.getRefDocs(
          "thread",
          "getLabels",
          "The user-created labels on the thread.",
        ),
      ),
      "thread.lastMessageDate": mi(
        MIT.DATE,
        (t: Thread) => t.getLastMessageDate(),
        this.getRefDocs(
          "thread",
          "getLastMessageDate",
          "The date of the thread's most recent message.",
        ),
      ),
      "thread.messageCount": mi(
        MIT.NUMBER,
        (t: Thread) => t.getMessageCount(),
        this.getRefDocs(
          "thread",
          "getMessageCount",
          "The number of messages in the thread.",
        ),
      ),
      "thread.permalink": mi(
        MIT.STRING,
        (t: Thread) => t.getPermalink(),
        this.getRefDocs(
          "thread",
          "getPermalink",
          "The permalink for the thread.",
        ),
      ),
      "thread.index": mi(
        MIT.NUMBER,
        ctx.thread.index,
        "The index number (0-based) of the thread.",
      ),
      "threadConfig.index": mi(
        MIT.NUMBER,
        ctx.thread.configIndex,
        "The index number (0-based) of the thead config.",
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
