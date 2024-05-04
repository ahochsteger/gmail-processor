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
import { RegexUtils } from "../utils/RegexUtils"
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

  public static buildQuery(threadMatchConfig: RequiredThreadMatchConfig) {
    let query = this.getStr(threadMatchConfig.query)
    query = query.trim().replace(/ +/g, " ")
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
        "Thread Subject",
        this.getRefDocs(
          keyPrefix,
          "getFirstMessageSubject",
          "The subject of the first message in the thread.",
        ),
      ),
      [`${keyPrefix}.hasStarredMessages`]: mi(
        MIT.BOOLEAN,
        (t: Thread) => t.hasStarredMessages(),
        "Starred Messages",
        this.getRefDocs(
          keyPrefix,
          "hasStarredMessages",
          "`true` if the thread has any starred messages.",
        ),
      ),
      [`${keyPrefix}.id`]: mi(
        MIT.STRING,
        (t: Thread) => t.getId(),
        "Thread ID",
        this.getRefDocs(keyPrefix, "getId", "The ID of the thread."),
      ),
      [`${keyPrefix}.isImportant`]: mi(
        MIT.STRING,
        (t: Thread) => t.isImportant(),
        "Important Thread",
        this.getRefDocs(
          keyPrefix,
          "isImportant",
          "`true` if the thread is marked as important.",
        ),
      ),
      [`${keyPrefix}.isInChats`]: mi(
        MIT.STRING,
        (t: Thread) => t.isInChats(),
        "Chat Thread",
        this.getRefDocs(
          keyPrefix,
          "isInChats",
          "`true` if the thread is labeled a chat.",
        ),
      ),
      [`${keyPrefix}.isInInbox`]: mi(
        MIT.STRING,
        (t: Thread) => t.isInInbox(),
        "Inbox Thread",
        this.getRefDocs(
          keyPrefix,
          "isInInbox",
          "`true` if the thread is in the inbox.",
        ),
      ),
      [`${keyPrefix}.isInPriorityInbox`]: mi(
        MIT.STRING,
        (t: Thread) => t.isInPriorityInbox(),
        "Priority Inbox Thread",
        this.getRefDocs(
          keyPrefix,
          "isInPriorityInbox",
          "`true` if the thread is in the priority inbox.",
        ),
      ),
      [`${keyPrefix}.isInSpam`]: mi(
        MIT.STRING,
        (t: Thread) => t.isInSpam(),
        "Spam Thread",
        this.getRefDocs(
          keyPrefix,
          "isInSpam",
          "`true` if the thread is marked as spam.",
        ),
      ),
      [`${keyPrefix}.isInTrash`]: mi(
        MIT.STRING,
        (t: Thread) => t.isInTrash(),
        "Trash Thread",
        this.getRefDocs(
          keyPrefix,
          "isInTrash",
          "`true` if the thread is marked as spam.",
        ),
      ),
      [`${keyPrefix}.isUnread`]: mi(
        MIT.STRING,
        (t: Thread) => t.isUnread(),
        "Unread Thread",
        this.getRefDocs(
          keyPrefix,
          "isUnread",
          "`true` if the thread has any unread messages.",
        ),
      ),
      [`${keyPrefix}.labels`]: mi(
        MIT.STRING,
        (t: Thread) => t.getLabels().map((l) => l.getName()),
        "Thread Labels",
        this.getRefDocs(
          keyPrefix,
          "getLabels",
          "The user-created labels on the thread.",
        ),
      ),
      [`${keyPrefix}.lastMessageDate`]: mi(
        MIT.DATE,
        (t: Thread) => t.getLastMessageDate(),
        "Thread Date",
        this.getRefDocs(
          keyPrefix,
          "getLastMessageDate",
          "The date of the thread's most recent message.",
        ),
      ),
      [`${keyPrefix}.messageCount`]: mi(
        MIT.NUMBER,
        (t: Thread) => t.getMessageCount(),
        "Thread Message Count",
        this.getRefDocs(
          keyPrefix,
          "getMessageCount",
          "The number of messages in the thread.",
        ),
      ),
      [`${keyPrefix}.permalink`]: mi(
        MIT.STRING,
        (t: Thread) => t.getPermalink(),
        "Thread Permalink",
        this.getRefDocs(
          keyPrefix,
          "getPermalink",
          "The permalink for the thread.",
        ),
      ),
      [`${keyPrefix}.index`]: mi(
        MIT.NUMBER,
        ctx.thread.index,
        "Thread Index",
        "The index number (0-based) of the thread.",
      ),
      [`${keyPrefix}.url`]: mi(
        MIT.STRING,
        (t: Thread) => `https://mail.google.com/mail/u/0/#inbox/${t.getId()}`,
        "Thread URL",
        "The URL of the thread.",
      ),
      "threadConfig.index": mi(
        MIT.NUMBER,
        ctx.thread.configIndex,
        "Thread Config Index",
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
        !RegexUtils.matchRegExp(
          matchConfig.firstMessageSubject,
          thread.getFirstMessageSubject() ?? "",
        )
      )
        return RegexUtils.noMatch(
          ctx,
          `firstMessageSubject '${thread.getFirstMessageSubject()}' does not match '${
            matchConfig.firstMessageSubject
          }'`,
        )
      if (
        matchConfig.minMessageCount != -1 &&
        thread.getMessageCount() < matchConfig.minMessageCount
      )
        return RegexUtils.noMatch(
          ctx,
          `messageCount ${thread.getMessageCount()} < minMessageCount ${
            matchConfig.minMessageCount
          }`,
        )
      if (
        matchConfig.maxMessageCount != -1 &&
        thread.getMessageCount() > matchConfig.maxMessageCount
      )
        return RegexUtils.noMatch(
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
        return RegexUtils.noMatch(
          ctx,
          `labels '${threadLabels}' do not contain all of '${matchConfig.labels}'`,
        )
    } catch (e) {
      return RegexUtils.matchError(
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
    ctx.log.trace(ctx, {
      location: "ThreadProcessor.processConfigs()",
      message: "Processing thread configs started ...",
    })
    for (let configIndex = 0; configIndex < configs.length; configIndex++) {
      result = this.processConfig(
        ctx,
        configs[configIndex],
        configIndex,
        result,
      )
    }
    ctx.log.trace(ctx, {
      location: "ThreadProcessor.processConfigs()",
      message: "Processing thread configs finished.",
    })
    return result
  }

  public static processConfig(
    ctx: ProcessingContext,
    config: RequiredThreadConfig,
    configIndex: number,
    result: ProcessingResult,
  ): ProcessingResult {
    ctx.log.trace(ctx, {
      location: "ThreadProcessor.processConfig()",
      message: `Processing thread config '${configIndex}' started ...`,
    })
    const matchConfig = this.buildMatchConfig(
      ctx,
      ctx.proc.config.global.thread.match,
      config.match,
    )
    const query = PatternUtil.substitute(ctx, this.buildQuery(matchConfig))
    ctx.log.info(`GMail search query: ${query}`)
    // Process all threads matching the search expression:
    const threads = ctx.proc.gmailAdapter.search(
      query,
      ctx.proc.config.settings.maxBatchSize,
    )
    ctx.log.info(`-> got ${threads.length} threads`)
    for (let threadIndex = 0; threadIndex < threads.length; threadIndex++) {
      ctx.proc.timer.checkMaxRuntimeReached()
      // TODO: Move everything from here on into processEntity()
      const thread = threads[threadIndex]
      if (!this.matches(ctx, matchConfig, thread)) {
        ctx.log.info(
          `Skipping non-matching thread id '${ctx.log.redact(ctx, thread.getId())}' (date:'${thread
            .getLastMessageDate()
            .toISOString()}',  firstMessageSubject:'${ctx.log.redact(ctx, thread.getFirstMessageSubject())}').`,
        )
        continue
      }
      const threadContext = this.buildContext(ctx, {
        object: thread,
        config: config,
        configIndex: configIndex,
        index: threadIndex,
      })
      result = this.processEntity(threadContext, result)
    }
    result.processedThreadConfigs += 1
    ctx.log.trace(ctx, {
      location: "ThreadProcessor.processConfig()",
      message: `Processing thread config '${configIndex}' finished.`,
    })
    return result
  }

  public static processEntity(
    ctx: ThreadContext,
    result: ProcessingResult = newProcessingResult(),
  ): ProcessingResult {
    const thread: GoogleAppsScript.Gmail.GmailThread = ctx.thread.object
    const config: RequiredThreadConfig = ctx.thread.config
    ctx.log.trace(ctx, {
      location: "ThreadProcessor.processEntity()",
      message: `Processing thread id '${ctx.log.redact(ctx, thread.getId())}' (subject:'${ctx.log.redact(ctx, thread.getFirstMessageSubject())}') started ...`,
    })
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
    ctx.log.trace(ctx, {
      location: "ThreadProcessor.processEntity()",
      message: `Processing thread id '${ctx.log.redact(ctx, thread.getId())}' finished.`,
    })
    return result
  }
}
