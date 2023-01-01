import { AbstractActions } from "./AbstractActions"
import { action, actionProvider } from "./ActionRegistry"
import "reflect-metadata"
import { MessageContext } from "../context/MessageContext"

@actionProvider("message")
export class MessageActions extends AbstractActions {
  constructor(
    protected messageContext: MessageContext,
  ) {
    super(messageContext)
  }

  @action("message.forward")
  public forward(to: string) {
    if (
      this.checkDryRun(
        `Forwarding message '${this.messageContext.message.getSubject()}' to '${to}' ...`,
      )
    )
      return
    this.messageContext.message.forward(to)
  }

  @action("message.markProcessed")
  public markProcessed() {
    if (this.processingContext.config.settings.processedMode == "read") {
      if (
        this.checkDryRun(
          `Marking message '${this.messageContext.message.getSubject()}' as processed ...`,
        )
      )
        return
      this.messageContext.message.markRead()
    }
  }

  @action("message.markRead")
  public markRead() {
    if (
      this.checkDryRun(
        `Marking message '${this.messageContext.message.getSubject()}' as read ...`,
      )
    )
      return
    this.messageContext.message.markRead()
  }

  @action("message.markUnread")
  public markUnread() {
    if (
      this.checkDryRun(
        `Marking message '${this.messageContext.message.getSubject()}' as unread ...`,
      )
    )
      return
    this.messageContext.message.markUnread()
  }

  @action("message.moveToTrash")
  public moveToTrash() {
    if (
      this.checkDryRun(
        `Moving message '${this.messageContext.message.getSubject()}' to trash ...`,
      )
    )
      return
    this.messageContext.message.moveToTrash()
  }

  @action("message.star")
  public star() {
    if (
      this.checkDryRun(
        `Marking message '${this.messageContext.message.getSubject()}' as starred ...`,
      )
    )
      return
    this.messageContext.message.star()
  }

  @action("message.unstar")
  public unstar() {
    if (
      this.checkDryRun(
        `Marking message '${this.messageContext.message.getSubject()}' as unstarred ...`,
      )
    )
      return
    this.messageContext.message.unstar()
  }
}
