import { EnvContext } from "../Context"
import { destructive, reading, writing } from "../utils/Decorators"
import { Adapter } from "./BaseAdapter"

export class GmailAdapter implements Adapter {
  constructor(public envContext: EnvContext) {}

  @reading()
  public search(
    query: string,
    max: number,
  ): GoogleAppsScript.Gmail.GmailThread[] {
    return this.envContext.env.gmailApp.search(query, 1, max)
  }

  @reading()
  public convertHtmlToPdf(html: string): string {
    const htmlBlob = this.envContext.env.utilities.newBlob(html, "text/html")
    return htmlBlob.getAs("application/pdf").getDataAsString()
  }

  @reading()
  public messageAsHtml(
    message: GoogleAppsScript.Gmail.GmailMessage,
    skipHeader = false,
  ): string {
    let html = ""
    if (!skipHeader) {
      html += `From: ${message.getFrom()}<br />
To: ${message.getTo()}<br />
Date: ${message.getDate()}<br />
Subject: ${message.getSubject()}<br />
<hr />
`
    }
    html += `${message.getBody()}
<hr />
`
    return html
  }

  @reading()
  public messageAsPdf(
    message: GoogleAppsScript.Gmail.GmailMessage,
    skipHeader = false,
  ) {
    return this.convertHtmlToPdf(this.messageAsHtml(message, skipHeader))
  }

  @writing()
  public messageForward(
    message: GoogleAppsScript.Gmail.GmailMessage,
    to: string,
  ) {
    console.info(`Forwarding message '${message.getSubject()}' to '${to}' ...`)
    return message.forward(to)
  }

  @writing()
  public messageMarkRead(message: GoogleAppsScript.Gmail.GmailMessage) {
    console.info(`Marking message '${message.getSubject()}' as read ...`)
    return message.markRead()
  }

  @writing()
  public messageMarkUnread(message: GoogleAppsScript.Gmail.GmailMessage) {
    console.info(`Marking message '${message.getSubject()}' as unread ...`)
    return message.markUnread()
  }

  @destructive()
  public messageMoveToTrash(message: GoogleAppsScript.Gmail.GmailMessage) {
    console.info(`Moving message '${message.getSubject()}' to trash ...`)
    return message.moveToTrash()
  }

  @writing()
  public messageStar(message: GoogleAppsScript.Gmail.GmailMessage) {
    console.info(`Marking message '${message.getSubject()}' as starred ...`)
    return message.star()
  }

  @writing()
  public messageUnstar(message: GoogleAppsScript.Gmail.GmailMessage) {
    console.info(`Marking message '${message.getSubject()}' as unstarred ...`)
    return message.unstar()
  }

  @writing()
  public threadAddLabel(
    thread: GoogleAppsScript.Gmail.GmailThread,
    labelName: string,
  ) {
    if (labelName !== "") {
      const label = this.envContext.env.gmailApp.getUserLabelByName(labelName)
      console.info(
        `Adding label '${labelName}' to thread '${thread.getFirstMessageSubject()}' ...`,
      )
      return thread.addLabel(label)
    }
  }

  @writing()
  public threadRemoveLabel(
    thread: GoogleAppsScript.Gmail.GmailThread,
    labelName: string,
  ) {
    if (labelName !== "") {
      const label = this.envContext.env.gmailApp.getUserLabelByName(labelName)
      console.info(
        `Removing label '${labelName}' from thread '${thread.getFirstMessageSubject()}' ...`,
      )
      return thread.removeLabel(label)
    }
  }

  /**
   * Generate HTML code for one message of a thread.
   */
  @reading()
  public threadAsHtml(
    thread: GoogleAppsScript.Gmail.GmailThread,
    skipHeader = false,
  ) {
    console.info(
      "  Generating HTML code of thread '" +
        thread.getFirstMessageSubject() +
        "'",
    )
    const messages = thread.getMessages()
    let html = ""
    for (const message of messages) {
      html += this.messageAsHtml(message, skipHeader)
    }
    return html
  }

  @reading()
  public threadAsPdf(
    thread: GoogleAppsScript.Gmail.GmailThread,
    skipHeader = false,
  ) {
    return this.convertHtmlToPdf(this.threadAsHtml(thread, skipHeader))
  }

  @writing()
  public threadMarkImportant(thread: GoogleAppsScript.Gmail.GmailThread) {
    console.info(
      `Marking thread '${thread.getFirstMessageSubject()}' as important ...`,
    )
    return thread.markImportant()
  }

  @writing()
  public threadMarkRead(thread: GoogleAppsScript.Gmail.GmailThread) {
    console.info(
      `Marking thread '${thread.getFirstMessageSubject()}' as read ...`,
    )
    return thread.markRead()
  }

  @writing()
  public threadMarkUnimportant(thread: GoogleAppsScript.Gmail.GmailThread) {
    console.info(
      `Marking thread '${thread.getFirstMessageSubject()}' as unimportant ...`,
    )
    return thread.markUnimportant()
  }

  @writing()
  public threadMarkUnread(thread: GoogleAppsScript.Gmail.GmailThread) {
    console.info(
      `Marking thread '${thread.getFirstMessageSubject()}' as unread ...`,
    )
    return thread.markUnread()
  }

  @writing()
  public threadMoveToArchive(thread: GoogleAppsScript.Gmail.GmailThread) {
    console.info(
      `Moving thread '${thread.getFirstMessageSubject()}' to archive ...`,
    )
    return thread.moveToArchive()
  }

  @writing()
  public threadMoveToInbox(thread: GoogleAppsScript.Gmail.GmailThread) {
    console.info(
      `Moving thread '${thread.getFirstMessageSubject()}' to inbox ...`,
    )
    return thread.moveToInbox()
  }

  @writing()
  public threadMoveToSpam(thread: GoogleAppsScript.Gmail.GmailThread) {
    console.info(
      `Moving thread '${thread.getFirstMessageSubject()}' to spam ...`,
    )
    return thread.moveToSpam()
  }

  @destructive()
  public threadMoveToTrash(thread: GoogleAppsScript.Gmail.GmailThread) {
    console.info(
      `Moving thread '${thread.getFirstMessageSubject()}' to trash ...`,
    )
    return thread.moveToTrash()
  }
}
