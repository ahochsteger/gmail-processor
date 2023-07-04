import {
  ContextType,
  MetaInfoType as MIT,
  Message,
  MessageContext,
  MessageInfo,
  MetaInfo,
  ProcessingResult,
  ThreadContext,
  newMetaInfo as mi,
  newProcessingResult,
} from "../Context"
import { ProcessingStage } from "../config/ActionConfig"
import { RequiredMessageConfig } from "../config/MessageConfig"
import { MessageFlag } from "../config/MessageFlag"
import {
  MessageMatchConfig,
  RequiredMessageMatchConfig,
  newMessageMatchConfig,
} from "../config/MessageMatchConfig"
import { MarkProcessedMethod } from "../config/SettingsConfig"
import { AttachmentProcessor } from "../processors/AttachmentProcessor"
import { PatternUtil } from "../utils/PatternUtil"
import { BaseProcessor } from "./BaseProcessor"

export class MessageProcessor extends BaseProcessor {
  public static buildContext(
    ctx: ThreadContext,
    info: MessageInfo,
  ): MessageContext {
    const messageContext: MessageContext = {
      ...ctx,
      type: ContextType.MESSAGE,
      message: info,
      messageMeta: {},
    }
    messageContext.messageMeta = this.buildMetaInfo(messageContext)
    messageContext.meta = {
      ...messageContext.procMeta,
      ...messageContext.threadMeta,
      ...messageContext.messageMeta,
    }
    return messageContext
  }

  public static matches(
    matchConfig: RequiredMessageMatchConfig,
    message: GoogleAppsScript.Gmail.GmailMessage,
  ) {
    if (!message.getFrom().match(matchConfig.from)) return false
    if (!message.getTo().match(matchConfig.to)) return false
    if (!message.getSubject().match(matchConfig.subject)) return false
    for (let i = 0; i < matchConfig.is.length; i++) {
      const flag = matchConfig.is[i]
      switch (flag) {
        case MessageFlag.READ:
          if (message.isUnread()) return false
          break
        case MessageFlag.UNREAD:
          if (!message.isUnread()) return false
          break
        case MessageFlag.STARRED:
          if (!message.isStarred()) return false
          break
        case MessageFlag.UNSTARRED:
          if (message.isStarred()) return false
          break
      }
    }
    return true
  }

  public static buildMatchConfig(
    ctx: ThreadContext,
    global: MessageMatchConfig,
    local: RequiredMessageMatchConfig,
  ): RequiredMessageMatchConfig {
    return newMessageMatchConfig({
      from: PatternUtil.substitute(
        ctx,
        this.effectiveValue(global.from, local.from, ""),
      ),
      is: (global.is || []).concat(local.is),
      newerThan: this.effectiveValue(global.newerThan, local.newerThan, ""),
      olderThan: this.effectiveValue(global.olderThan, local.olderThan, ""),
      subject: PatternUtil.substitute(
        ctx,
        this.effectiveValue(global.subject, local.subject, ""),
      ),
      to: PatternUtil.substitute(
        ctx,
        this.effectiveValue(global.to, local.to, ""),
      ),
    })
  }

  public static getRegexMapFromMessageMatchConfig(
    mmc: MessageMatchConfig | undefined,
  ): Map<string, string> {
    const m = new Map<string, string>()
    if (mmc === undefined) {
      return m
    }
    if (mmc.from) m.set("from", mmc.from)
    if (mmc.subject) m.set("subject", mmc.subject)
    if (mmc.to) m.set("to", mmc.to)
    return m
  }

  public static buildMetaInfo(ctx: MessageContext): MetaInfo {
    const message = ctx.message.object
    const keyPrefix = "message"
    ctx.meta
    let m: MetaInfo = {
      [`${keyPrefix}.bcc`]: mi(
        MIT.STRING,
        (msg: Message) => msg.getBcc(),
        this.getRefDocs(
          keyPrefix,
          "getBcc",
          "The comma-separated recipients bcc'd on the message.",
        ),
      ),
      [`${keyPrefix}.cc`]: mi(
        MIT.STRING,
        (msg: Message) => msg.getCc(),
        this.getRefDocs(
          keyPrefix,
          "getCc",
          "The comma-separated recipients cc'd on the message.",
        ),
      ),
      [`${keyPrefix}.date`]: mi(
        MIT.DATE,
        (msg: Message) => msg.getDate(),
        this.getRefDocs(
          keyPrefix,
          "getDate",
          "The date and time of the message.",
        ),
      ),
      [`${keyPrefix}.from`]: mi(
        MIT.STRING,
        (msg: Message) => msg.getFrom(),
        this.getRefDocs(keyPrefix, "getFrom", "The sender of the message."),
      ),
      "message.from.domain": mi(
        MIT.STRING,
        (msg: Message) => msg.getFrom().split("@")[1],
        this.getRefDocs(
          keyPrefix,
          "getFrom",
          "The sender domain of the message.",
        ),
      ),
      [`${keyPrefix}.id`]: mi(
        MIT.STRING,
        (msg: Message) => msg.getId(),
        this.getRefDocs(keyPrefix, "getId", "The ID of the message."),
      ),
      [`${keyPrefix}.isDraft`]: mi(
        MIT.BOOLEAN,
        (msg: Message) => msg.isDraft(),
        this.getRefDocs(
          keyPrefix,
          "isDraft",
          "`true` if the message is a draft.",
        ),
      ),
      [`${keyPrefix}.isInChats`]: mi(
        MIT.BOOLEAN,
        (msg: Message) => msg.isInChats(),
        this.getRefDocs(
          keyPrefix,
          "isInChats",
          "`true` if the message is a chat.",
        ),
      ),
      [`${keyPrefix}.isInInbox`]: mi(
        MIT.BOOLEAN,
        (msg: Message) => msg.isInInbox(),
        this.getRefDocs(
          keyPrefix,
          "isInInbox",
          "`true` if the message is in the inbox.",
        ),
      ),
      [`${keyPrefix}.isInPriorityInbox`]: mi(
        MIT.BOOLEAN,
        (msg: Message) => msg.isInPriorityInbox(),
        this.getRefDocs(
          keyPrefix,
          "isInPriorityInbox",
          "`true` if if the message is in the priority inbox.",
        ),
      ),
      [`${keyPrefix}.isInTrash`]: mi(
        MIT.BOOLEAN,
        (msg: Message) => msg.isInTrash(),
        this.getRefDocs(
          keyPrefix,
          "isInTrash",
          "`true` if the message is in the trash.",
        ),
      ),
      [`${keyPrefix}.isStarred`]: mi(
        MIT.BOOLEAN,
        (msg: Message) => msg.isStarred(),
        this.getRefDocs(
          keyPrefix,
          "isStarred",
          "`true` if the message is starred.",
        ),
      ),
      [`${keyPrefix}.isUnread`]: mi(
        MIT.BOOLEAN,
        (msg: Message) => msg.isUnread(),
        this.getRefDocs(
          keyPrefix,
          "isUnread",
          "`true` if the message is unread.",
        ),
      ),
      [`${keyPrefix}.replyTo`]: mi(
        MIT.STRING,
        (msg: Message) => msg.getReplyTo(),
        this.getRefDocs(
          keyPrefix,
          "getReplyTo",
          "The reply-to address of the message (usually the sender).",
        ),
      ),
      [`${keyPrefix}.subject`]: mi(
        MIT.STRING,
        (msg: Message) => msg.getSubject(),
        this.getRefDocs(keyPrefix, "getSubject", "The subject of the message."),
      ),
      [`${keyPrefix}.to`]: mi(
        MIT.STRING,
        (msg: Message) => msg.getTo(),
        this.getRefDocs(
          keyPrefix,
          "getTo",
          "The comma-separated recipients of the message.",
        ),
      ),
      [`${keyPrefix}.index`]: mi(
        MIT.NUMBER,
        ctx.message.index,
        "The index number (0-based) of the message.",
      ),
      "messageConfig.index": mi(
        MIT.NUMBER,
        ctx.message.configIndex,
        "The index number (0-based) of the message config.",
      ),
    }
    const messageConfig = ctx.message.config
    if (messageConfig.match) {
      // Test for message rules
      m = this.buildRegExpSubustitutionMap(
        ctx,
        m,
        keyPrefix,
        this.getRegexMapFromMessageMatchConfig(messageConfig.match),
      )
      if (!m[`${keyPrefix}.matched`]) {
        ctx.log.info(
          `Skipped message with id ${message.getId()} because it did not match the regex rules ...`,
        )
      }
    }
    return m
  }

  public static processConfigs(
    ctx: ThreadContext,
    configs: RequiredMessageConfig[],
    result: ProcessingResult = newProcessingResult(),
  ): ProcessingResult {
    for (let configIndex = 0; configIndex < configs.length; configIndex++) {
      const config = configs[configIndex]
      ctx.log.info(`Processing of message config '${config.name}' started ...`)
      const messages = ctx.thread.object.getMessages()
      const matchConfig = this.buildMatchConfig(
        ctx,
        ctx.proc.config.global.message.match,
        config.match,
      )
      for (let index = 0; index < messages.length; index++) {
        if (
          ctx.proc.config.settings.markProcessedMethod ===
          MarkProcessedMethod.MARK_MESSAGE_READ
        ) {
          ctx.proc.timer.checkMaxRuntimeReached()
        }
        const message = messages[index]
        if (!this.matches(matchConfig, message)) {
          ctx.log.debug(
            `Skipping non-matching message id ${message.getId()} (date:'${message
              .getDate()
              .toISOString()}',  subject:'${message.getSubject()}', from:${message.getFrom()}).`,
          )
          continue
        }
        const messageContext = this.buildContext(ctx, {
          object: message,
          config: config,
          configIndex: configIndex,
          index: index,
        })
        result = this.processEntity(messageContext, result)
      }
      ctx.log.info(`Processing of message config '${config.name}' finished.`)
    }
    return result
  }

  /**
   * Processes a message.
   * @param message The message to be processed.
   * @param rule The rule to be processed.
   */
  public static processEntity(
    ctx: MessageContext,
    result: ProcessingResult = newProcessingResult(),
  ): ProcessingResult {
    const config = ctx.message.config
    const message = ctx.message.object
    ctx.log.info(
      `Processing of message id ${message.getId()} (date:'${message
        .getDate()
        .toISOString()}',  subject:'${message.getSubject()}', from:${message.getFrom()}) started ...`,
    )
    // Execute pre-main actions:
    result = this.executeActions(
      ctx,
      ProcessingStage.PRE_MAIN,
      result,
      ctx.proc.config.global.message.actions,
      ctx.message.config.actions,
    )

    // Process attachment configs:
    if (config.attachments) {
      // New rule configuration format
      result = AttachmentProcessor.processConfigs(
        ctx,
        config.attachments,
        result,
      )
    }

    // Execute post-main actions:
    result = this.executeActions(
      ctx,
      ProcessingStage.POST_MAIN,
      result,
      ctx.message.config.actions,
      ctx.proc.config.global.message.actions,
    )
    ctx.log.info(`Processing of message id ${message.getId()} finished.`)
    return result
  }
}
