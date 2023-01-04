import "reflect-metadata"
import { AbstractActions } from "./AbstractActions"
import { action, actionProvider } from "./ActionRegistry"
import { MessageContext } from "../context/MessageContext"
import { GmailAdapter } from "../adapter/GmailAdapter"

@actionProvider("message")
export class MessageActions extends AbstractActions {
  private gmailAdapter: GmailAdapter
  private message: GoogleAppsScript.Gmail.GmailMessage
  constructor(protected messageContext: MessageContext) {
    super(messageContext)
    this.gmailAdapter = messageContext.gasContext.gmailAdapter
    this.message = messageContext.message
  }

  @action("message.forward")
  public forward(to: string) {
    this.gmailAdapter.messageForward(this.message, to)
  }

  @action("message.markProcessed")
  public markProcessed() {
    if (this.processingContext.config.settings.processedMode == "read") {
      this.gmailAdapter.messageMarkRead(this.message)
    }
  }

  @action("message.markRead")
  public markRead() {
    this.gmailAdapter.messageMarkRead(this.message)
  }

  @action("message.markUnread")
  public markUnread() {
    this.gmailAdapter.messageMarkUnread(this.message)
  }

  @action("message.moveToTrash")
  public moveToTrash() {
    this.gmailAdapter.messageMoveToTrash(this.message)
  }

  @action("message.star")
  public star() {
    this.gmailAdapter.messageStar(this.message)
  }

  @action("message.unstar")
  public unstar() {
    this.gmailAdapter.messageUnstar(this.message)
  }
}
