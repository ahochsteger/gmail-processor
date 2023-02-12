import { MessageFlag } from "../config/MessageFlag"
import { MessageConfig } from "../config/MessageConfig"
import { MessageContext } from "../context/MessageContext"
import { ThreadContext } from "../context/ThreadContext"
import { AttachmentProcessor } from "../processors/AttachmentProcessor"
import { BaseProcessor } from "./BaseProcessor"

export class MessageProcessor extends BaseProcessor {
  constructor(public threadContext: ThreadContext) {
    super()
  }

  public processMessageConfigs(messageConfigs: MessageConfig[]) {
    for (let i = 0; i < messageConfigs.length; i++) {
      const messageConfig = messageConfigs[i]
      messageConfig.name =
        messageConfig.name !== "" ? messageConfig.name : `message-cfg-${i + 1}`
      this.processMessageConfig(messageConfig)
    }
  }

  public matches(
    messageConfig: MessageConfig,
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

  public processMessageConfig(messageConfig: MessageConfig) {
    console.info(
      `      Processing of message config '${messageConfig.name}' started ...`,
    )
    for (const message of this.threadContext.thread.getMessages()) {
      if (!this.matches(messageConfig, message)) {
        continue
      }
      const messageContext = new MessageContext(
        this.threadContext,
        messageConfig,
        message,
      )
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
  public processMessage(messageContext: MessageContext) {
    // TODO: Check, if this.processingContext would be better here!
    const messageConfig: MessageConfig = messageContext.messageConfig
    const message = messageContext.message
    console.info(
      `        Processing of message '${message.getSubject()}' (id:${message.getId()}) started ...`,
    )
    const attachmentProcessor: AttachmentProcessor = new AttachmentProcessor(
      messageContext,
    )
    if (messageConfig.attachmentHandler) {
      // New rule configuration format
      attachmentProcessor.processAttachmentConfigs(
        messageConfig.attachmentHandler,
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
