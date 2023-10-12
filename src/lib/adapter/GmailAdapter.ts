import { EnvContext } from "../Context"
import { SettingsConfig } from "../config/SettingsConfig"
import { BaseAdapter } from "./BaseAdapter"

export class GmailAdapter extends BaseAdapter {
  constructor(
    public ctx: EnvContext,
    public settings: SettingsConfig,
  ) {
    super(ctx, settings)
  }

  public search(
    query: string,
    max: number,
  ): GoogleAppsScript.Gmail.GmailThread[] {
    return this.ctx.env.gmailApp.search(query, 0, max)
  }

  public convertHtmlToPdf(html: string): GoogleAppsScript.Base.Blob {
    const htmlBlob = this.ctx.env.utilities.newBlob(html, "text/html")
    return htmlBlob.getAs("application/pdf")
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
  ): GoogleAppsScript.Base.Blob {
    return this.convertHtmlToPdf(this.messageAsHtml(message, skipHeader))
  }

  public messageForward(
    message: GoogleAppsScript.Gmail.GmailMessage,
    to: string,
  ) {
    this.ctx.log.info(
      `Forwarding message '${message.getSubject()}' to '${to}' ...`,
    )
    return message.forward(to)
  }

  public messageMarkRead(message: GoogleAppsScript.Gmail.GmailMessage) {
    this.ctx.log.info(`Marking message '${message.getSubject()}' as read ...`)
    return message.markRead()
  }

  public messageMarkUnread(message: GoogleAppsScript.Gmail.GmailMessage) {
    this.ctx.log.info(`Marking message '${message.getSubject()}' as unread ...`)
    return message.markUnread()
  }

  public messageMoveToTrash(message: GoogleAppsScript.Gmail.GmailMessage) {
    this.ctx.log.info(`Moving message '${message.getSubject()}' to trash ...`)
    return message.moveToTrash()
  }

  public messageStar(message: GoogleAppsScript.Gmail.GmailMessage) {
    this.ctx.log.info(
      `Marking message '${message.getSubject()}' as starred ...`,
    )
    return message.star()
  }

  public messageUnstar(message: GoogleAppsScript.Gmail.GmailMessage) {
    this.ctx.log.info(
      `Marking message '${message.getSubject()}' as un-starred ...`,
    )
    return message.unstar()
  }

  public threadAddLabel(
    thread: GoogleAppsScript.Gmail.GmailThread,
    labelName: string,
  ) {
    if (!labelName) {
      throw new Error(`Invalid label name: '${labelName}'`)
    }
    let label: GoogleAppsScript.Gmail.GmailLabel =
      this.ctx.env.gmailApp.getUserLabelByName(labelName)
    if (!label) {
      this.ctx.log.info(`Creating non-existing label '${labelName}' ...`)
      label = this.ctx.env.gmailApp.createLabel(labelName)
    }
    this.ctx.log.info(
      `Adding label '${labelName}' to thread '${thread.getFirstMessageSubject()}' ...`,
    )
    return thread.addLabel(label)
  }

  public threadRemoveLabel(
    thread: GoogleAppsScript.Gmail.GmailThread,
    labelName: string,
  ) {
    if (labelName !== "") {
      const label = this.ctx.env.gmailApp.getUserLabelByName(labelName)
      this.ctx.log.info(
        `Removing label '${labelName}' from thread '${thread.getFirstMessageSubject()}' ...`,
      )
      return thread.removeLabel(label)
    }
  }

  /**
   * Generate HTML code for one message of a thread.
   * @param thread - The thread to be represented as HTML
   * @param skipHeader - Whether to skip the header in the generated HTML
   */
  public threadAsHtml(
    thread: GoogleAppsScript.Gmail.GmailThread,
    skipHeader = false,
  ): string {
    this.ctx.log.info(
      `Generating HTML code of thread '${thread.getFirstMessageSubject()}'`,
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
  ): GoogleAppsScript.Base.Blob {
    return this.convertHtmlToPdf(this.threadAsHtml(thread, skipHeader))
  }

  public threadMarkImportant(thread: GoogleAppsScript.Gmail.GmailThread) {
    this.ctx.log.info(
      `Marking thread '${thread.getFirstMessageSubject()}' as important ...`,
    )
    return thread.markImportant()
  }

  public threadMarkRead(thread: GoogleAppsScript.Gmail.GmailThread) {
    this.ctx.log.info(
      `Marking thread '${thread.getFirstMessageSubject()}' as read ...`,
    )
    return thread.markRead()
  }

  public threadMarkUnimportant(thread: GoogleAppsScript.Gmail.GmailThread) {
    this.ctx.log.info(
      `Marking thread '${thread.getFirstMessageSubject()}' as unimportant ...`,
    )
    return thread.markUnimportant()
  }

  public threadMarkUnread(thread: GoogleAppsScript.Gmail.GmailThread) {
    this.ctx.log.info(
      `Marking thread '${thread.getFirstMessageSubject()}' as unread ...`,
    )
    return thread.markUnread()
  }

  public threadMoveToArchive(thread: GoogleAppsScript.Gmail.GmailThread) {
    this.ctx.log.info(
      `Moving thread '${thread.getFirstMessageSubject()}' to archive ...`,
    )
    return thread.moveToArchive()
  }

  public threadMoveToInbox(thread: GoogleAppsScript.Gmail.GmailThread) {
    this.ctx.log.info(
      `Moving thread '${thread.getFirstMessageSubject()}' to inbox ...`,
    )
    return thread.moveToInbox()
  }

  public threadMoveToSpam(thread: GoogleAppsScript.Gmail.GmailThread) {
    this.ctx.log.info(
      `Moving thread '${thread.getFirstMessageSubject()}' to spam ...`,
    )
    return thread.moveToSpam()
  }

  public threadMoveToTrash(thread: GoogleAppsScript.Gmail.GmailThread) {
    this.ctx.log.info(
      `Moving thread '${thread.getFirstMessageSubject()}' to trash ...`,
    )
    return thread.moveToTrash()
  }
}
