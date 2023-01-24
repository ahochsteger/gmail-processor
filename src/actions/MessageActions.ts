import { AbstractActions } from "./AbstractActions"
import { action } from "./ActionRegistry"
import { MessageContext } from "../context/MessageContext"
import { GmailAdapter } from "../adapter/GmailAdapter"
import { ConflictStrategy } from "../adapter/GDriveAdapter"

export class MessageActions extends AbstractActions {
  private gmailAdapter: GmailAdapter
  private message: GoogleAppsScript.Gmail.GmailMessage
  constructor(protected messageContext: MessageContext) {
    super(messageContext)
    this.gmailAdapter = messageContext.gmailAdapter
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

  /**
   * Generate a PDF document from the message and store it to GDrive.
   */
  @action("message.storeAsPdfToGDrive")
  public storeAsPdfToGDrive(
    location: string,
    conflictStrategy: ConflictStrategy,
    skipHeader = false,
  ) {
    return this.processingContext.gdriveAdapter.createFile(
      location,
      this.gmailAdapter.messageAsPdf(this.messageContext.message, skipHeader),
      "application/pdf",
      "",
      conflictStrategy,
    )
  }
}
