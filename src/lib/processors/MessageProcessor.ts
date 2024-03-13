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
} from "../config/MessageMatchConfig"
import { MarkProcessedMethod } from "../config/SettingsConfig"
import { AttachmentProcessor } from "../processors/AttachmentProcessor"
import { PatternUtil } from "../utils/PatternUtil"
import { RegexUtils } from "../utils/RegexUtils"
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
    this.updateContextMeta(messageContext)
    return messageContext
  }

  public static matches(
    ctx: ThreadContext,
    matchConfig: RequiredMessageMatchConfig,
    message: GoogleAppsScript.Gmail.GmailMessage,
  ) {
    try {
      if (!RegexUtils.matchRegExp(matchConfig.body, message.getBody()))
        return RegexUtils.noMatch(
          ctx,
          `body '${message.getBody().slice(0, 32)}...' does not match '${
            matchConfig.body
          }'`,
        )
      if (!RegexUtils.matchRegExp(matchConfig.from, message.getFrom()))
        return RegexUtils.noMatch(
          ctx,
          `from '${message.getFrom()}' does not match '${matchConfig.from}'`,
        )
      if (
        !RegexUtils.matchRegExp(matchConfig.plainBody, message.getPlainBody())
      )
        return RegexUtils.noMatch(
          ctx,
          `plainBody '${message
            .getPlainBody()
            .slice(0, 32)}...' does not match '${matchConfig.plainBody}'`,
        )
      if (!RegexUtils.matchRegExp(matchConfig.to, message.getTo()))
        return RegexUtils.noMatch(
          ctx,
          `to '${message.getTo()}' does not match '${matchConfig.to}'`,
        )
      if (
        !RegexUtils.matchRegExp(matchConfig.subject, message.getSubject() ?? "")
      )
        return RegexUtils.noMatch(
          ctx,
          `subject '${message.getSubject()}' does not match '${
            matchConfig.subject
          }'`,
        )
      if (!this.matchTimestamp(matchConfig.newerThan, message.getDate(), true))
        return RegexUtils.noMatch(
          ctx,
          `date '${message.getDate()}' not newer than '${
            matchConfig.newerThan
          }'`,
        )
      if (!this.matchTimestamp(matchConfig.olderThan, message.getDate(), false))
        return RegexUtils.noMatch(
          ctx,
          `date '${message.getDate()}' not older than '${
            matchConfig.olderThan
          }'`,
        )
      for (const flag of matchConfig.is) {
        switch (flag) {
          case MessageFlag.READ:
            if (message.isUnread())
              return RegexUtils.noMatch(ctx, `message is not read`)
            break
          case MessageFlag.UNREAD:
            if (!message.isUnread())
              return RegexUtils.noMatch(ctx, `message is read`)
            break
          case MessageFlag.STARRED:
            if (!message.isStarred())
              return RegexUtils.noMatch(ctx, `message is not starred`)
            break
          case MessageFlag.UNSTARRED:
            if (message.isStarred())
              return RegexUtils.noMatch(ctx, `message is starred`)
            break
        }
      }
    } catch (e) {
      return RegexUtils.matchError(
        ctx,
        `Skipping message (id:${message.getId()}) due to error during match check: ${e} (matchConfig: ${JSON.stringify(
          matchConfig,
        )})`,
      )
    }
    return true
  }

  public static buildMatchConfig(
    ctx: ThreadContext,
    global: MessageMatchConfig,
    local: RequiredMessageMatchConfig,
  ): RequiredMessageMatchConfig {
    const matchConfig: RequiredMessageMatchConfig = {
      body: PatternUtil.substitute(
        ctx,
        this.effectiveValue(global.body, local.body, ""),
      ),
      from: PatternUtil.substitute(
        ctx,
        this.effectiveValue(global.from, local.from, ""),
      ),
      is: (global.is ?? []).concat(local.is),
      newerThan: this.effectiveValue(global.newerThan, local.newerThan, ""),
      olderThan: this.effectiveValue(global.olderThan, local.olderThan, ""),
      plainBody: PatternUtil.substitute(
        ctx,
        this.effectiveValue(global.plainBody, local.plainBody, ""),
      ),
      subject: PatternUtil.substitute(
        ctx,
        this.effectiveValue(global.subject, local.subject, ""),
      ),
      to: PatternUtil.substitute(
        ctx,
        this.effectiveValue(global.to, local.to, ""),
      ),
    }
    return matchConfig
  }

  public static getRegexMapFromMessageMatchConfig(
    mmc: MessageMatchConfig | undefined,
  ): Map<string, string> {
    const m = new Map<string, string>()
    if (mmc === undefined) {
      return m
    }
    if (mmc.body) m.set("body", mmc.body)
    if (mmc.from) m.set("from", mmc.from)
    if (mmc.plainBody) m.set("plainBody", mmc.plainBody)
    if (mmc.subject) m.set("subject", mmc.subject)
    if (mmc.to) m.set("to", mmc.to)
    return m
  }

  public static buildMetaInfo(ctx: MessageContext): MetaInfo {
    const keyPrefix = "message"
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
      [`${keyPrefix}.body`]: mi(
        MIT.STRING,
        (msg: Message) => msg.getBody(),
        this.getRefDocs(keyPrefix, "getBody", "The body of the message."),
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
      [`${keyPrefix}.plainBody`]: mi(
        MIT.STRING,
        (msg: Message) => msg.getPlainBody(),
        this.getRefDocs(
          keyPrefix,
          "getPlainBody",
          "The plain body of the message.",
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
      [`${keyPrefix}.url`]: mi(
        MIT.STRING,
        (msg: Message) =>
          `https://mail.google.com/mail/u/0/#inbox/${msg.getId()}`,
        "The URL of the message.",
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
    m = this.buildRegExpSubstitutionMap(
      ctx,
      m,
      keyPrefix,
      this.getRegexMapFromMessageMatchConfig(messageConfig.match),
    )
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
        if (!this.matches(ctx, matchConfig, message)) {
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
      result.processedMessageConfigs += 1
      ctx.log.info(`Processing of message config '${config.name}' finished.`)
    }
    return result
  }

  /**
   * Processes a message.
   * @param ctx - The message context
   * @param result - The processing result up to now
   * @returns The result after processing
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
    result.processedMessages += 1
    ctx.log.info(`Processing of message id ${message.getId()} finished.`)
    return result
  }
}
