import { ProcessingContext } from "../context/ProcessingContext"
import { AbstractActions } from "./AbstractActions"
import "reflect-metadata"
import { action } from "./ActionRegistry"

export class MessageActions extends AbstractActions {
  constructor(
    context: ProcessingContext,
    logger: Console = console,
    dryRun = false,
    private message: GoogleAppsScript.Gmail.GmailMessage,
  ) {
    super(context, logger, dryRun)
  }

  @action("message.forward")
  public forward(to: string) {
    if (
      this.checkDryRun(
        `Forwarding message '${this.message.getSubject()}' to '${to}' ...`,
      )
    )
      return
    this.message.forward(to)
  }

  @action("message.markProcessed")
  public markProcessed() {
    if (this.context.config.settings.processedMode == "read") {
      if (
        this.checkDryRun(
          `Marking message '${this.message.getSubject()}' as processed ...`,
        )
      )
        return
      this.message.markRead()
    }
  }

  @action("message.markRead")
  public markRead() {
    if (
      this.checkDryRun(
        `Marking message '${this.message.getSubject()}' as read ...`,
      )
    )
      return
    this.message.markRead()
  }

  @action("message.markUnread")
  public markUnread() {
    if (
      this.checkDryRun(
        `Marking message '${this.message.getSubject()}' as unread ...`,
      )
    )
      return
    this.message.markUnread()
  }

  @action("message.moveToTrash")
  public moveToTrash() {
    if (
      this.checkDryRun(
        `Moving message '${this.message.getSubject()}' to trash ...`,
      )
    )
      return
    this.message.moveToTrash()
  }

  @action("message.star")
  public star() {
    if (
      this.checkDryRun(
        `Marking message '${this.message.getSubject()}' as starred ...`,
      )
    )
      return
    this.message.star()
  }

  @action("message.unstar")
  public unstar() {
    if (
      this.checkDryRun(
        `Marking message '${this.message.getSubject()}' as unstarred ...`,
      )
    )
      return
    this.message.unstar()
  }
}
