import { EnvContext } from "../Context"
import { skipOnDryRun } from "../utils/Decorators"
import { Adapter } from "./BaseAdapter"

export class GmailAdapter implements Adapter {
  constructor(public envContext: EnvContext) {}

  public search(
    query: string,
    max: number,
  ): GoogleAppsScript.Gmail.GmailThread[] {
    return this.envContext.gmailApp.search(query, 1, max)
  }

  // TODO: Maybe move to a utility class - is not Gmail-specific
  public convertHtmlToPdf(html: string): string {
    const htmlBlob = this.envContext.utilities.newBlob(html, "text/html")
    return htmlBlob.getAs("application/pdf").getDataAsString()
  }

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

  public messageAsPdf(
    message: GoogleAppsScript.Gmail.GmailMessage,
    skipHeader = false,
  ) {
    return this.convertHtmlToPdf(this.messageAsHtml(message, skipHeader))
  }

  @skipOnDryRun()
  public messageForward(
    message: GoogleAppsScript.Gmail.GmailMessage,
    to: string,
  ) {
    console.info(`Forwarding message '${message.getSubject()}' to '${to}' ...`)
    return message.forward(to)
  }

  @skipOnDryRun()
  public messageMarkRead(message: GoogleAppsScript.Gmail.GmailMessage) {
    console.info(`Marking message '${message.getSubject()}' as read ...`)
    return message.markRead()
  }

  @skipOnDryRun()
  public messageMarkUnread(message: GoogleAppsScript.Gmail.GmailMessage) {
    console.info(`Marking message '${message.getSubject()}' as unread ...`)
    return message.markUnread()
  }

  @skipOnDryRun()
  public messageMoveToTrash(message: GoogleAppsScript.Gmail.GmailMessage) {
    console.info(`Moving message '${message.getSubject()}' to trash ...`)
    return message.moveToTrash()
  }

  @skipOnDryRun()
  public messageStar(message: GoogleAppsScript.Gmail.GmailMessage) {
    console.info(`Marking message '${message.getSubject()}' as starred ...`)
    return message.star()
  }

  @skipOnDryRun()
  public messageUnstar(message: GoogleAppsScript.Gmail.GmailMessage) {
    console.info(`Marking message '${message.getSubject()}' as unstarred ...`)
    return message.unstar()
  }

  @skipOnDryRun()
  public threadAddLabel(
    thread: GoogleAppsScript.Gmail.GmailThread,
    labelName: string,
  ) {
    if (labelName !== "") {
      const label = this.envContext.gmailApp.getUserLabelByName(labelName)
      console.info(
        `Adding label '${labelName}' to thread '${thread.getFirstMessageSubject()}' ...`,
      )
      return thread.addLabel(label)
    }
  }

  @skipOnDryRun()
  public threadRemoveLabel(
    thread: GoogleAppsScript.Gmail.GmailThread,
    labelName: string,
  ) {
    if (labelName !== "") {
      const label = this.envContext.gmailApp.getUserLabelByName(labelName)
      console.info(
        `Removing label '${labelName}' from thread '${thread.getFirstMessageSubject()}' ...`,
      )
      return thread.removeLabel(label)
    }
  }

  /**
   * Generate HTML code for one message of a thread.
   */
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

  public threadAsPdf(
    thread: GoogleAppsScript.Gmail.GmailThread,
    skipHeader = false,
  ) {
    return this.convertHtmlToPdf(this.threadAsHtml(thread, skipHeader))
  }

  @skipOnDryRun()
  public threadMarkImportant(thread: GoogleAppsScript.Gmail.GmailThread) {
    console.info(
      `Marking thread '${thread.getFirstMessageSubject()}' as important ...`,
    )
    return thread.markImportant()
  }

  @skipOnDryRun()
  public threadMarkRead(thread: GoogleAppsScript.Gmail.GmailThread) {
    console.info(
      `Marking thread '${thread.getFirstMessageSubject()}' as read ...`,
    )
    return thread.markRead()
  }

  @skipOnDryRun()
  public threadMarkUnimportant(thread: GoogleAppsScript.Gmail.GmailThread) {
    console.info(
      `Marking thread '${thread.getFirstMessageSubject()}' as unimportant ...`,
    )
    return thread.markUnimportant()
  }

  @skipOnDryRun()
  public threadMarkUnread(thread: GoogleAppsScript.Gmail.GmailThread) {
    console.info(
      `Marking thread '${thread.getFirstMessageSubject()}' as unread ...`,
    )
    return thread.markUnread()
  }

  @skipOnDryRun()
  public threadMoveToArchive(thread: GoogleAppsScript.Gmail.GmailThread) {
    console.info(
      `Moving thread '${thread.getFirstMessageSubject()}' to archive ...`,
    )
    return thread.moveToArchive()
  }

  @skipOnDryRun()
  public threadMoveToInbox(thread: GoogleAppsScript.Gmail.GmailThread) {
    console.info(
      `Moving thread '${thread.getFirstMessageSubject()}' to inbox ...`,
    )
    return thread.moveToInbox()
  }

  @skipOnDryRun()
  public threadMoveToSpam(thread: GoogleAppsScript.Gmail.GmailThread) {
    console.info(
      `Moving thread '${thread.getFirstMessageSubject()}' to spam ...`,
    )
    return thread.moveToSpam()
  }

  @skipOnDryRun()
  public threadMoveToTrash(thread: GoogleAppsScript.Gmail.GmailThread) {
    console.info(
      `Moving thread '${thread.getFirstMessageSubject()}' to trash ...`,
    )
    return thread.moveToTrash()
  }
}
