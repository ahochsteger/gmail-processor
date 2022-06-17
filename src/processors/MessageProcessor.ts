import { ActionProvider } from "../actions/ActionProvider"
import { Actions } from "../actions/Actions"
import { Config } from "../config/Config"
import { MessageRule } from "../config/MessageRule"
import { MessageContext } from "../context/MessageContext"
import { ProcessingContext } from "../context/ProcessingContext"
import { ThreadContext } from "../context/ThreadContext"
import { AttachmentProcessor } from "../processors/AttachmentProcessor"

export class MessageProcessor {
  public logger: Console = console
  public actions: Actions
  public config: Config
  public threadContext: ThreadContext

  constructor(
    public gmailApp: GoogleAppsScript.Gmail.GmailApp,
    public actionProvider: ActionProvider,
    public processingContext: ProcessingContext,
  ) {
    this.actions = actionProvider.getActions()
    this.config = processingContext.config
    if (processingContext.threadContext) {
      this.threadContext = processingContext.threadContext
    } else {
      throw Error("Parameter processingContext has no threadContext set!")
    }
  }

  public processMessageRules(messageRules: MessageRule[]) {
    for (const messageRule of messageRules) {
      this.processMessageRule(messageRule)
    }
  }

  public processMessageRule(messageRule: MessageRule) {
    for (const message of this.threadContext.thread.getMessages()) {
      const messageContext = new MessageContext(
        messageRule,
        message,
        this.threadContext.thread.getMessages().indexOf(message),
        this.threadContext.threadRule.messageRules.indexOf(messageRule),
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
    const messageRule: MessageRule = messageContext.messageRule
    const message = messageContext.message
    this.logger.log(
      "INFO:       Processing message: " +
        message.getSubject() +
        " (" +
        message.getId() +
        ")",
    )

    const attachmentProcessor: AttachmentProcessor = new AttachmentProcessor(
      this.gmailApp,
      this.actionProvider,
      this.processingContext,
    )
    if (messageRule.attachmentRules) {
      // New rule configuration format
      attachmentProcessor.processAttachmentRules(messageRule.attachmentRules)
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
