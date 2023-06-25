import {
  MessageContext,
  MessageInfo,
  MetaInfo,
  ProcessingResult,
  ThreadContext,
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
    const metaInfo = new MetaInfo()
    const messageContext: MessageContext = {
      ...ctx,
      message: info,
      messageMeta: metaInfo,
    }
    messageContext.messageMeta = this.buildMetaInfo(messageContext, metaInfo)
    messageContext.meta = new MetaInfo([
      ...messageContext.procMeta,
      ...messageContext.threadMeta,
      ...messageContext.messageMeta,
    ])
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

  public static buildMetaInfo(
    ctx: MessageContext,
    m: MetaInfo = new MetaInfo(),
  ): MetaInfo {
    const message = ctx.message.object
    m.set("message.bcc", message.getBcc())
    m.set("message.cc", message.getCc())
    m.set("message.date", message.getDate())
    m.set("message.from", message.getFrom())
    m.set("message.from.domain", message.getFrom().split("@")[1])
    m.set("message.id", message.getId())
    m.set("message.isDraft", message.isDraft())
    m.set("message.isInChats", message.isInChats())
    m.set("message.isInInbox", message.isInInbox())
    m.set("message.isInPriorityInbox", message.isInPriorityInbox())
    m.set("message.isInTrash", message.isInTrash())
    m.set("message.isStarred", message.isStarred())
    m.set("message.isUnread", message.isUnread())
    m.set("message.replyTo", message.getReplyTo())
    m.set("message.subject", message.getSubject())
    m.set("message.to", message.getTo())
    m.set("message.index", ctx.message.index)
    m.set("messageConfig.index", ctx.message.configIndex)
    const messageConfig = ctx.message.config
    if (messageConfig.match) {
      // Test for message rules
      m = this.buildRegExpSubustitutionMap(
        ctx,
        m,
        "message",
        this.getRegexMapFromMessageMatchConfig(messageConfig.match),
      )
      if (!m.get("messgage.matched")) {
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
