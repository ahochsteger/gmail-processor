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
import { RequiredThreadConfig } from "../config/ThreadConfig"
import {
  RequiredThreadMatchConfig,
  ThreadMatchConfig,
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
    this.updateContextMeta(threadContext)
    return threadContext
  }

  public static buildQuery(
    ctx: ProcessingContext,
    threadMatchConfig: RequiredThreadMatchConfig,
  ) {
    let query = this.getStr(threadMatchConfig.query)
    query = query.trim().replace(/ +/g, " ")
    ctx.log.debug(`Built GMail search query: ${query}`)
    return query
  }

  public static buildMatchConfig(
    ctx: ProcessingContext,
    global: ThreadMatchConfig,
    local: RequiredThreadMatchConfig,
  ): RequiredThreadMatchConfig {
    const matchConfig: RequiredThreadMatchConfig = {
      firstMessageSubject: PatternUtil.substitute(
        ctx,
        this.effectiveValue(
          global.firstMessageSubject,
          local.firstMessageSubject,
          "",
        ),
      ),
      labels: PatternUtil.substitute(
        ctx,
        this.effectiveCSV(global.labels, local.labels),
      ),
      query: PatternUtil.substitute(
        ctx,
        `${global.query} ${local.query}`.trim(),
      ),
      maxMessageCount: this.effectiveMaxNumber(
        global.maxMessageCount,
        local.maxMessageCount,
        -1,
      ),
      minMessageCount: this.effectiveMinNumber(
        global.minMessageCount,
        local.minMessageCount,
        -1,
      ),
    }
    return matchConfig
  }

  public static getRegexMapFromThreadMatchConfig(
    cfg: ThreadMatchConfig | undefined,
  ): Map<string, string> {
    const m = new Map<string, string>()
    if (cfg === undefined) {
      return m
    }
    if (cfg.firstMessageSubject)
      m.set("firstMessageSubject", cfg.firstMessageSubject)
    if (cfg.labels) m.set("labels", cfg.labels)
    return m
  }

  public static buildMetaInfo(ctx: ThreadContext): MetaInfo {
    const keyPrefix = "thread"
    let m: MetaInfo = {
      [`${keyPrefix}.firstMessageSubject`]: mi(
        MIT.STRING,
        (t: Thread) => t.getFirstMessageSubject(),
        this.getRefDocs(
          keyPrefix,
          "getFirstMessageSubject",
          "The subject of the first message in the thread.",
        ),
      ),
      [`${keyPrefix}.hasStarredMessages`]: mi(
        MIT.BOOLEAN,
        (t: Thread) => t.hasStarredMessages(),
        this.getRefDocs(
          keyPrefix,
          "hasStarredMessages",
          "`true` if the thread has any starred messages.",
        ),
      ),
      [`${keyPrefix}.id`]: mi(
        MIT.STRING,
        (t: Thread) => t.getId(),
        this.getRefDocs(keyPrefix, "getId", "The ID of the thread."),
      ),
      [`${keyPrefix}.isImportant`]: mi(
        MIT.STRING,
        (t: Thread) => t.isImportant(),
        this.getRefDocs(
          keyPrefix,
          "isImportant",
          "`true` if the thread is marked as important.",
        ),
      ),
      [`${keyPrefix}.isInChats`]: mi(
        MIT.STRING,
        (t: Thread) => t.isInChats(),
        this.getRefDocs(
          keyPrefix,
          "isInChats",
          "`true` if the thread is labeled a chat.",
        ),
      ),
      [`${keyPrefix}.isInInbox`]: mi(
        MIT.STRING,
        (t: Thread) => t.isInInbox(),
        this.getRefDocs(
          keyPrefix,
          "isInInbox",
          "`true` if the thread is in the inbox.",
        ),
      ),
      [`${keyPrefix}.isInPriorityInbox`]: mi(
        MIT.STRING,
        (t: Thread) => t.isInPriorityInbox(),
        this.getRefDocs(
          keyPrefix,
          "isInPriorityInbox",
          "`true` if the thread is in the priority inbox.",
        ),
      ),
      [`${keyPrefix}.isInSpam`]: mi(
        MIT.STRING,
        (t: Thread) => t.isInSpam(),
        this.getRefDocs(
          keyPrefix,
          "isInSpam",
          "`true` if the thread is marked as spam.",
        ),
      ),
      [`${keyPrefix}.isInTrash`]: mi(
        MIT.STRING,
        (t: Thread) => t.isInTrash(),
        this.getRefDocs(
          keyPrefix,
          "isInTrash",
          "`true` if the thread is marked as spam.",
        ),
      ),
      [`${keyPrefix}.isUnread`]: mi(
        MIT.STRING,
        (t: Thread) => t.isUnread(),
        this.getRefDocs(
          keyPrefix,
          "isUnread",
          "`true` if the thread has any unread messages.",
        ),
      ),
      [`${keyPrefix}.labels`]: mi(
        MIT.STRING,
        (t: Thread) => t.getLabels().map((l) => l.getName()),
        this.getRefDocs(
          keyPrefix,
          "getLabels",
          "The user-created labels on the thread.",
        ),
      ),
      [`${keyPrefix}.lastMessageDate`]: mi(
        MIT.DATE,
        (t: Thread) => t.getLastMessageDate(),
        this.getRefDocs(
          keyPrefix,
          "getLastMessageDate",
          "The date of the thread's most recent message.",
        ),
      ),
      [`${keyPrefix}.messageCount`]: mi(
        MIT.NUMBER,
        (t: Thread) => t.getMessageCount(),
        this.getRefDocs(
          keyPrefix,
          "getMessageCount",
          "The number of messages in the thread.",
        ),
      ),
      [`${keyPrefix}.permalink`]: mi(
        MIT.STRING,
        (t: Thread) => t.getPermalink(),
        this.getRefDocs(
          keyPrefix,
          "getPermalink",
          "The permalink for the thread.",
        ),
      ),
      [`${keyPrefix}.index`]: mi(
        MIT.NUMBER,
        ctx.thread.index,
        "The index number (0-based) of the thread.",
      ),
      [`${keyPrefix}.url`]: mi(
        MIT.STRING,
        (t: Thread) => `https://mail.google.com/mail/u/0/#inbox/${t.getId()}`,
        "The URL of the thread.",
      ),
      "threadConfig.index": mi(
        MIT.NUMBER,
        ctx.thread.configIndex,
        "The index number (0-based) of the thead config.",
      ),
    }
    const threadConfig = ctx.thread.config
    m = this.buildRegExpSubstitutionMap(
      ctx,
      m,
      keyPrefix,
      this.getRegexMapFromThreadMatchConfig(threadConfig.match),
    )
    return m
  }

  public static matches(
    ctx: ProcessingContext,
    matchConfig: RequiredThreadMatchConfig,
    thread: GoogleAppsScript.Gmail.GmailThread,
  ): boolean {
    try {
      if (
        !this.matchRegExp(
          matchConfig.firstMessageSubject,
          thread.getFirstMessageSubject() ?? "",
        )
      )
        return this.noMatch(
          ctx,
          `firstMessageSubject '${thread.getFirstMessageSubject()}' does not match '${
            matchConfig.firstMessageSubject
          }'`,
        )
      if (
        matchConfig.minMessageCount != -1 &&
        thread.getMessageCount() < matchConfig.minMessageCount
      )
        return this.noMatch(
          ctx,
          `messageCount ${thread.getMessageCount()} < minMessageCount ${
            matchConfig.minMessageCount
          }`,
        )
      if (
        matchConfig.maxMessageCount != -1 &&
        thread.getMessageCount() > matchConfig.maxMessageCount
      )
        return this.noMatch(
          ctx,
          `messageCount ${thread.getMessageCount()} > maxMessageCount ${
            matchConfig.maxMessageCount
          }`,
        )
      const threadLabels = thread
        .getLabels()
        .map((l) => l.getName())
        .join(",")
      if (
        !matchConfig.labels
          .split(",")
          .every((matchLabel) =>
            thread.getLabels().map((l) => l.getName() == matchLabel),
          )
      )
        return this.noMatch(
          ctx,
          `labels '${threadLabels}' do not contain all of '${matchConfig.labels}'`,
        )
    } catch (e) {
      return this.matchError(
        ctx,
        `Skipping thread (id:${JSON.stringify(
          thread.getId(),
        )}) due to error during match check: ${e} (matchConfig: ${JSON.stringify(
          matchConfig,
        )})`,
      )
    }
    return true
  }

  public static processConfigs(
    ctx: ProcessingContext,
    configs: RequiredThreadConfig[],
    result: ProcessingResult = newProcessingResult(),
  ): ProcessingResult {
    for (let configIndex = 0; configIndex < configs.length; configIndex++) {
      const config = configs[configIndex]
      ctx.log.info(
        `Processing of thread config index '${configIndex}' started ...`,
      )
      const matchConfig = this.buildMatchConfig(
        ctx,
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
      ctx.log.info(`-> got ${threads.length} threads`)
      for (let threadIndex = 0; threadIndex < threads.length; threadIndex++) {
        const thread = threads[threadIndex]
        if (!this.matches(ctx, matchConfig, thread)) {
          ctx.log.debug(
            `Skipping non-matching thread id ${thread.getId()} (date:'${thread
              .getLastMessageDate()
              .toISOString()}',  firstMessageSubject:'${thread.getFirstMessageSubject()}').`,
          )
          continue
        }
        ctx.proc.timer.checkMaxRuntimeReached()
        const threadContext = this.buildContext(ctx, {
          object: thread,
          config: config,
          configIndex: configIndex,
          index: threadIndex,
        })
        result = this.processEntity(threadContext, result)
      }
      result.processedThreadConfigs += 1
      ctx.log.info(
        `Processing of thread config index '${configIndex}' finished.`,
      )
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
    result.processedThreads += 1
    ctx.log.info(`Processing of thread id ${thread.getId()} finished.`)
    return result
  }
}
