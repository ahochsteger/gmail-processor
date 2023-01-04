import { ProcessingContext } from "../context/ProcessingContext"
import { skipOnDryRun } from "../utils/Decorators"
import { BaseAdapter } from "./BaseAdapter"

export class GmailAdapter extends BaseAdapter {
  private gmailApp: GoogleAppsScript.Gmail.GmailApp
  constructor(
    public processingContext: ProcessingContext,
  ) {
    super(processingContext)
    this.gmailApp = processingContext.gasContext.gmailApp
  }

  // TODO: Maybe move to a utility class - is not Gmail-specific
  public convertHtmlToPdf(
    html: string,
  ): string {
    const htmlBlob = Utilities.newBlob(html, "text/html")
    return htmlBlob.getAs("application/pdf").getDataAsString()
  }

  public messageAsHtml(
    message: GoogleAppsScript.Gmail.GmailMessage,
  ): string {
    const html = "From: " + message.getFrom() + "<br />\n"
      + "To: " + message.getTo() + "<br />\n"
      + "Date: " + message.getDate() + "<br />\n"
      + "Subject: " + message.getSubject() + "<br />\n"
      + "<hr />\n"
      + message.getBody() + "\n"
      + "<hr />\n"
    return html
  }

  public messageAsPdf(message: GoogleAppsScript.Gmail.GmailMessage) {
    return this.convertHtmlToPdf(this.messageAsHtml(message))
  }

  @skipOnDryRun()
  public messageForward(
    message: GoogleAppsScript.Gmail.GmailMessage,
    to: string,
  ) {
    this.logger.info(`Forwarding message '${message.getSubject()}' to '${to}' ...`)
    return message.forward(to)
  }

  @skipOnDryRun()
  public messageMarkRead(message: GoogleAppsScript.Gmail.GmailMessage) {
    this.logger.info(`Marking message '${message.getSubject()}' as read ...`)
    return message.markRead()
  }

  @skipOnDryRun()
  public messageMarkUnread(message: GoogleAppsScript.Gmail.GmailMessage) {
    this.logger.info(`Marking message '${message.getSubject()}' as unread ...`)
    return message.markUnread()
  }

  @skipOnDryRun()
  public messageMoveToTrash(message: GoogleAppsScript.Gmail.GmailMessage) {
    this.logger.info(`Moving message '${message.getSubject()}' to trash ...`)
    return message.moveToTrash()
  }

  @skipOnDryRun()
  public messageStar(message: GoogleAppsScript.Gmail.GmailMessage) {
    this.logger.info(`Marking message '${message.getSubject()}' as starred ...`)
    return message.star()
  }

  @skipOnDryRun()
  public messageUnstar(message: GoogleAppsScript.Gmail.GmailMessage) {
    this.logger.info(`Marking message '${message.getSubject()}' as unstarred ...`)
    return message.unstar()
  }


  @skipOnDryRun()
  public threadAddLabel(
    thread: GoogleAppsScript.Gmail.GmailThread,
    labelName: string
  ) {
    if (labelName !== "") {
      const label =
        this.gmailApp.getUserLabelByName(labelName)
      this.logger.info(
        `Adding label '${labelName}' to thread '${thread.getFirstMessageSubject()}' ...`,
      )
      return thread.addLabel(label)
    }
  }

  @skipOnDryRun()
  public threadRemoveLabel(
    thread: GoogleAppsScript.Gmail.GmailThread,
    labelName: string
  ) {
    if (labelName !== "") {
      const label =
        this.gmailApp.getUserLabelByName(labelName)
      this.logger.info(
        `Removing label '${labelName}' from thread '${thread.getFirstMessageSubject()}' ...`,
      )
      return thread.removeLabel(label)
    }
  }

  /**
   * Generate HTML code for one message of a thread.
   */
  public threadAsHtml(thread: GoogleAppsScript.Gmail.GmailThread) {
    this.logger.info(
      "  Generating HTML code of thread '" +
        thread.getFirstMessageSubject() +
        "'",
    )
    const messages = thread.getMessages()
    let html = ""
    for (const message of messages) {
      html += this.messageAsHtml(message)
    }
    return html
  }

  public threadAsPdf(thread: GoogleAppsScript.Gmail.GmailThread) {
    return this.convertHtmlToPdf(this.threadAsHtml(thread))
  }

  @skipOnDryRun()
  public threadMarkImportant(thread: GoogleAppsScript.Gmail.GmailThread) {
    this.logger.info(`Marking thread '${thread.getFirstMessageSubject()}' as important ...`)
    return thread.markImportant()
  }

  @skipOnDryRun()
  public threadMarkRead(thread: GoogleAppsScript.Gmail.GmailThread) {
    this.logger.info(`Marking thread '${thread.getFirstMessageSubject()}' as read ...`)
    return thread.markRead()
  }

  @skipOnDryRun()
  public threadMarkUnimportant(thread: GoogleAppsScript.Gmail.GmailThread) {
    this.logger.info(`Marking thread '${thread.getFirstMessageSubject()}' as unimportant ...`)
    return thread.markUnimportant()
  }

  @skipOnDryRun()
  public threadMarkUnread(thread: GoogleAppsScript.Gmail.GmailThread) {
    this.logger.info(`Marking thread '${thread.getFirstMessageSubject()}' as unread ...`)
    return thread.markUnread()
  }

  @skipOnDryRun()
  public threadMoveToArchive(thread: GoogleAppsScript.Gmail.GmailThread) {
    this.logger.info(`Moving thread '${thread.getFirstMessageSubject()}' to archive ...`)
    return thread.moveToArchive()
  }

  @skipOnDryRun()
  public threadMoveToInbox(thread: GoogleAppsScript.Gmail.GmailThread) {
    this.logger.info(`Moving thread '${thread.getFirstMessageSubject()}' to inbox ...`)
    return thread.moveToInbox()
  }

  @skipOnDryRun()
  public threadMoveToSpam(thread: GoogleAppsScript.Gmail.GmailThread) {
    this.logger.info(`Moving thread '${thread.getFirstMessageSubject()}' to spam ...`)
    return thread.moveToSpam()
  }

  @skipOnDryRun()
  public threadMoveToTrash(thread: GoogleAppsScript.Gmail.GmailThread) {
    this.logger.info(`Moving thread '${thread.getFirstMessageSubject()}' to trash ...`)
    return thread.moveToTrash()
  }

}
