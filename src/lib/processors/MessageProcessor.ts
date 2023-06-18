import {
  MessageContext,
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
import { BaseProcessor } from "./BaseProcessor"

export class MessageProcessor extends BaseProcessor {
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
    global: MessageMatchConfig,
    local: RequiredMessageMatchConfig,
  ): RequiredMessageMatchConfig {
    return newMessageMatchConfig({
      from: this.effectiveValue(global.from, local.from, ""),
      is: (global.is || []).concat(local.is),
      newerThan: this.effectiveValue(global.newerThan, local.newerThan, ""),
      olderThan: this.effectiveValue(global.olderThan, local.olderThan, ""),
      subject: this.effectiveValue(global.subject, local.subject, ""),
      to: this.effectiveValue(global.to, local.to, ""),
    })
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
          continue
        }
        const messageContext: MessageContext = {
          ...ctx,
          message: {
            object: message,
            config: config,
            configIndex: configIndex,
            index: index,
          },
        }
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
      `Processing of message '${message.getSubject()}' (id:${message.getId()}) started ...`,
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
    ctx.log.info(
      `Processing of message '${message.getSubject()}' (id:${message.getId()}) finished.`,
    )
    return result
  }
}
