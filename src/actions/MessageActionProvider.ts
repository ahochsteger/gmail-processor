import { ProcessingContext } from "../context/ProcessingContext"
import { AbstractActionProvider } from "./AbstractActionProvider"

export class MessageActionProvider extends AbstractActionProvider {
  constructor(
    context: ProcessingContext,
    logger: Console = console,
    dryRun = false,
    private message: GoogleAppsScript.Gmail.GmailMessage,
  ) {
    super(context, logger, dryRun)
  }

  forward(to: string) {
    if (this.checkDryRun(`Forwarding message '${this.message.getSubject()}' to '${to}' ...`)) return
    this.message.forward(to)
  }

  markAsProcessed() {
    if (this.context.config.settings.processedMode == "read") {
      if (this.checkDryRun(`Marking message '${this.message.getSubject()}' as processed ...`)) return
      this.message.markRead()
    }
  }

  markRead() {
    if (this.checkDryRun(`Marking message '${this.message.getSubject()}' as read ...`)) return
    this.message.markRead()
  }

  markUnread() {
    if (this.checkDryRun(`Marking message '${this.message.getSubject()}' as unread ...`)) return
    this.message.markUnread()
  }

  moveToTrash() {
    if (this.checkDryRun(`Moving message '${this.message.getSubject()}' to trash ...`)) return
    this.message.moveToTrash()
  }

  star() {
    if (this.checkDryRun(`Marking message '${this.message.getSubject()}' as starred ...`)) return
    this.message.star()
  }

  unstar() {
    if (this.checkDryRun(`Marking message '${this.message.getSubject()}' as unstarred ...`)) return
    this.message.unstar()
  }
}
