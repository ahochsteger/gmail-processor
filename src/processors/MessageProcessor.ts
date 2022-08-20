import { MessageFlag } from "../config/MessageFlag"
import { Config } from "../config/Config"
import { MessageConfig } from "../config/MessageConfig"
import { MessageContext } from "../context/MessageContext"
import { ProcessingContext } from "../context/ProcessingContext"
import { ThreadContext } from "../context/ThreadContext"
import { AttachmentProcessor } from "../processors/AttachmentProcessor"

export class MessageProcessor {
  public logger: Console = console
  public config: Config
  public threadContext: ThreadContext

  constructor(
    public gmailApp: GoogleAppsScript.Gmail.GmailApp,
    public processingContext: ProcessingContext,
  ) {
    this.config = processingContext.config
    if (processingContext.threadContext) {
      this.threadContext = processingContext.threadContext
    } else {
      throw Error("Parameter processingContext has no threadContext set!")
    }
  }

  public processMessageRules(messageConfigs: MessageConfig[]) {
    for (const messageConfig of messageConfigs) {
      this.processMessageRule(messageConfig)
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

  public processMessageRule(messageConfig: MessageConfig) {
    for (const message of this.threadContext.thread.getMessages()) {
      if (!this.matches(messageConfig, message)) {
        continue
      }
      const messageContext = new MessageContext(
        messageConfig,
        message,
        this.threadContext.thread.getMessages().indexOf(message),
        this.threadContext.threadConfig.handler.indexOf(messageConfig),
      )
      this.processingContext.messageContext = messageContext
      this.processMessage(messageContext)
    }
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
    this.logger.info(
      "      Processing message: " +
        message.getSubject() +
        " (" +
        message.getId() +
        ")",
    )

    const attachmentProcessor: AttachmentProcessor = new AttachmentProcessor(
      this.gmailApp,
      this.processingContext,
    )
    if (messageConfig.handler) {
      // New rule configuration format
      attachmentProcessor.processAttachmentRules(messageConfig.handler)
    }
    // } else { // Old rule configuration format
    //     // TODO: Convert old rule configuration into new format instead of duplicate implementation
    //     const attachments = message.getAttachments()
    //     for (let attIdx = 0; attIdx < attachments.length; attIdx++) {
    //         processAttachment(thread, msgIdx, messageRule, config, attIdx)
    //     }
    // }
  }
}
