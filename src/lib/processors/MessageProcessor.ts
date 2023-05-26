import { MessageContext, ThreadContext } from "../Context"
import { ProcessingStage } from "../config/ActionConfig"
import { RequiredMessageConfig } from "../config/MessageConfig"
import { MessageFlag } from "../config/MessageFlag"
import { AttachmentProcessor } from "../processors/AttachmentProcessor"

export class MessageProcessor {
  public static processMessageConfigs(
    ctx: ThreadContext,
    messageConfigs: RequiredMessageConfig[],
  ) {
    for (let i = 0; i < messageConfigs.length; i++) {
      const messageConfig = messageConfigs[i]
      messageConfig.name =
        messageConfig.name !== "" ? messageConfig.name : `message-cfg-${i + 1}`
      this.processMessageConfig(ctx, messageConfig, i)
    }
  }

  public static matches(
    messageConfig: RequiredMessageConfig,
    message: GoogleAppsScript.Gmail.GmailMessage,
  ) {
    if (!message.getFrom().match(messageConfig.match.from)) return false
    if (!message.getTo().match(messageConfig.match.to)) return false
    if (!message.getSubject().match(messageConfig.match.subject)) return false
    // TODO: Simplify using map/reduce:
    for (let i = 0; i < messageConfig.match.is.length; i++) {
      const flag = messageConfig.match.is[i]
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

  public static processMessageConfig(
    ctx: ThreadContext,
    messageConfig: RequiredMessageConfig,
    messageConfigIndex: number,
  ) {
    ctx.log.info(
      `      Processing of message config '${messageConfig.name}' started ...`,
    )
    const messages = ctx.thread.object.getMessages()
    for (let messageIndex = 0; messageIndex < messages.length; messageIndex++) {
      const message = messages[messageIndex]
      if (!this.matches(messageConfig, message)) {
        continue
      }
      const messageContext: MessageContext = {
        ...ctx,
        message: {
          object: message,
          config: messageConfig,
          configIndex: messageConfigIndex,
          index: messageIndex,
        },
      }
      this.processMessage(messageContext)
    }
    ctx.log.info(
      `      Processing of message config '${messageConfig.name}' finished.`,
    )
  }

  /**
   * Processes a message.
   * @param message The message to be processed.
   * @param rule The rule to be processed.
   */
  public static processMessage(ctx: MessageContext) {
    const messageConfig = ctx.message.config
    const message = ctx.message.object
    ctx.log.info(
      `        Processing of message '${message.getSubject()}' (id:${message.getId()}) started ...`,
    )
    // Execute pre-actions:
    ctx.message.config.actions
      .filter((cfg) => cfg.processingStage == ProcessingStage.PRE)
      .forEach((action) =>
        ctx.proc.actionRegistry.executeAction(ctx, action.name, action.args),
      )

    // Process attachment configs:
    if (messageConfig.attachments) {
      // New rule configuration format
      AttachmentProcessor.processAttachmentConfigs(
        ctx,
        messageConfig.attachments,
      )
    }

    // Execute post-actions:
    ctx.thread.config.actions
      .filter((cfg) => cfg.processingStage == ProcessingStage.POST)
      .forEach((action) =>
        ctx.proc.actionRegistry.executeAction(ctx, action.name, action.args),
      )
    ctx.log.info(
      `        Processing of message '${message.getSubject()}' (id:${message.getId()}) finished.`,
    )
  }
}
