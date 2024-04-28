import { EnvContext } from "../Context"
import { SettingsConfig } from "../config/SettingsConfig"
import { BaseAdapter } from "./BaseAdapter"
import { ExportOptionsType, GmailExportAdapter } from "./GmailExportAdapter"

export class GmailAdapter extends BaseAdapter {
  private gmailExportAdapter: GmailExportAdapter
  constructor(
    public ctx: EnvContext,
    public settings: SettingsConfig,
  ) {
    super(ctx, settings)
    this.gmailExportAdapter = new GmailExportAdapter(ctx, settings)
  }

  public search(
    query: string,
    max: number,
  ): GoogleAppsScript.Gmail.GmailThread[] {
    return this.ctx.env.gmailApp.search(query, 0, max)
  }

  public messageAsHtml(
    message: GoogleAppsScript.Gmail.GmailMessage,
    options: ExportOptionsType,
  ): GoogleAppsScript.Base.Blob {
    this.ctx.log.info(
      `Generating HTML code of message '${message.getSubject()}'`,
    )
    const html = this.gmailExportAdapter.generateMessagesHtml(
      [message],
      options,
    )
    return this.ctx.env.utilities.newBlob(html, "text/html")
  }

  public messageAsPdf(
    message: GoogleAppsScript.Gmail.GmailMessage,
    options: ExportOptionsType,
  ): GoogleAppsScript.Base.Blob {
    this.ctx.log.info(
      `Exporting message '${message.getSubject()}' as PDF document ...`,
    )
    const blob = this.messageAsHtml(message, options)
    return blob.getAs("application/pdf")
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
    options: ExportOptionsType,
  ): GoogleAppsScript.Base.Blob {
    this.ctx.log.info(
      `Generating HTML code of thread '${thread.getFirstMessageSubject()}'`,
    )
    const messages = thread.getMessages()
    const html = this.gmailExportAdapter.generateMessagesHtml(messages, options)
    return this.ctx.env.utilities.newBlob(html, "text/html")
  }

  public threadAsPdf(
    thread: GoogleAppsScript.Gmail.GmailThread,
    options: ExportOptionsType,
  ): GoogleAppsScript.Base.Blob {
    this.ctx.log.info(
      `Exporting thread '${thread.getFirstMessageSubject()}' as PDF document ...`,
    )
    const blob = this.threadAsHtml(thread, options)
    return blob.getAs("application/pdf")
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
