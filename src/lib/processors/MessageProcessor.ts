import { MessageContext, ThreadContext } from "../Context"
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
    console.info(
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
    console.info(
      `      Processing of message config '${messageConfig.name}' finished.`,
    )
  }

  /**
   * Processes a message.
   * @param message The message to be processed.
   * @param rule The rule to be processed.
   */
  public static processMessage(messageContext: MessageContext) {
    const messageConfig = messageContext.message.config
    const message = messageContext.message.object
    console.info(
      `        Processing of message '${message.getSubject()}' (id:${message.getId()}) started ...`,
    )
    if (messageConfig.attachments) {
      // New rule configuration format
      AttachmentProcessor.processAttachmentConfigs(
        messageContext,
        messageConfig.attachments,
      )
    }
    // } else { // Old rule configuration format
    //     // TODO: Convert old rule configuration into new format instead of duplicate implementation
    //     const attachments = message.getAttachments()
    //     for (let attIdx = 0; attIdx < attachments.length; attIdx++) {
    //         processAttachment(thread, msgIdx, messageRule, config, attIdx)
    //     }
    // }
    console.info(
      `        Processing of message '${message.getSubject()}' (id:${message.getId()}) finished.`,
    )
  }
}
