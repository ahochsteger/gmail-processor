import { ProcessingContext } from "../context/ProcessingContext"
import { ConflictStrategy, GDriveAdapter } from "../adapter/GDriveAdapter"
import { AbstractActions } from "./AbstractActions"
import { action, actionProvider } from "./ActionRegistry"
import "reflect-metadata"

@actionProvider("thread")
export class ThreadActions extends AbstractActions {
  private thread: GoogleAppsScript.Gmail.GmailThread
  constructor(
    context: ProcessingContext,
    logger: Console = console,
    dryRun = false,
  ) {
    super(context, logger, dryRun)
    this.thread = context.threadContext!.thread!
  }

  @action("thread.markProcessed")
  public markProcessed() {
    if (this.context.config.settings.processedMode == "label") {
      if (
        this.checkDryRun(
          `Marking thread '${this.thread.getFirstMessageSubject()}' as processed ...`,
        )
      )
        return
      this.addLabel(this.context.config.settings.processedLabel)
    }
  }

  @action("thread.markImportant")
  public markImportant() {
    if (
      this.checkDryRun(
        `Marking thread '${this.thread.getFirstMessageSubject()}' as important ...`,
      )
    )
      return
    this.thread.markImportant()
  }

  @action("thread.markRead")
  public markRead() {
    if (
      this.checkDryRun(
        `Marking thread '${this.thread.getFirstMessageSubject()}' as read ...`,
      )
    )
      return
    this.thread.markRead()
  }

  @action("thread.markUnimportant")
  public markUnimportant() {
    if (
      this.checkDryRun(
        `Marking thread '${this.thread.getFirstMessageSubject()}' as unimportant ...`,
      )
    )
      return
    this.thread.markUnimportant()
  }

  @action("thread.markUnread")
  public markUnread() {
    if (
      this.checkDryRun(
        `Marking thread '${this.thread.getFirstMessageSubject()}' as unread ...`,
      )
    )
      return
    this.thread.markUnread()
  }

  @action("thread.moveToArchive")
  public moveToArchive() {
    if (
      this.checkDryRun(
        `Moving thread '${this.thread.getFirstMessageSubject()}' to archive ...`,
      )
    )
      return
    this.thread.moveToArchive()
  }

  @action("thread.moveToInbox")
  public moveToInbox() {
    if (
      this.checkDryRun(
        `Moving thread '${this.thread.getFirstMessageSubject()}' to inbox ...`,
      )
    )
      return
    this.thread.moveToInbox()
  }

  @action("thread.moveToSpam")
  public moveToSpam() {
    if (
      this.checkDryRun(
        `Moving thread '${this.thread.getFirstMessageSubject()}' to spam ...`,
      )
    )
      return
    this.thread.moveToSpam()
  }

  @action("thread.moveToTrash")
  public moveToTrash() {
    if (
      this.checkDryRun(
        `Moving thread '${this.thread.getFirstMessageSubject()}' to trash ...`,
      )
    )
      return
    this.thread.moveToTrash()
  }

  @action("thread.addLabel")
  public addLabel(labelName: string) {
    if (
      this.checkDryRun(
        `Adding label '${labelName}' to thread '${this.thread.getFirstMessageSubject()}' ...`,
      )
    )
      return
    if (labelName !== "") {
      const label =
        this.context.gasContext.gmailApp.getUserLabelByName(labelName)
      this.thread.addLabel(label)
    }
  }

  @action("thread.removeLabel")
  public removeLabel(labelName: string) {
    if (
      this.checkDryRun(
        `Removing label '${labelName}' from thread '${this.thread.getFirstMessageSubject()}' ...`,
      )
    )
      return
    if (labelName !== "") {
      const label =
        this.context.gasContext.gmailApp.getUserLabelByName(labelName)
      this.thread.removeLabel(label)
    }
  }

  /**
   * Generate HTML code for one message of a thread.
   */
  private processThreadToHtml(thread: GoogleAppsScript.Gmail.GmailThread) {
    this.logger.info(
      "  Generating HTML code of thread '" +
        thread.getFirstMessageSubject() +
        "'",
    )
    const messages = thread.getMessages()
    let html = ""
    for (const message of messages) {
      html += "From: " + message.getFrom() + "<br />\n"
      html += "To: " + message.getTo() + "<br />\n"
      html += "Date: " + message.getDate() + "<br />\n"
      html += "Subject: " + message.getSubject() + "<br />\n"
      html += "<hr />\n"
      html += message.getBody() + "\n"
      html += "<hr />\n"
    }
    return html
  }

  /**
   * Generate a PDF document for the whole thread using HTML from .
   */
  @action("thread.storeAsPdfToGDrive")
  public storeAsPdfToGDrive(
    gdriveApp: GoogleAppsScript.Drive.DriveApp,
    location: string,
    conflictStrategy: ConflictStrategy,
  ) {
    const html = this.processThreadToHtml(this.thread)
    const htmlBlob = Utilities.newBlob(html, "text/html")
    const gdriveAdapter: GDriveAdapter = new GDriveAdapter(
      this.logger,
      this.dryRun,
      gdriveApp,
    ) // TODO: Don't instanciate here - get from context
    if (
      this.checkDryRun(
        `Saving PDF copy of thread '${this.thread.getFirstMessageSubject()}' to '${location}' ...`,
      )
    )
      return
    const pdfFile = gdriveAdapter.createFile(
      location,
      htmlBlob.getAs("application/pdf").getDataAsString(),
      "application/pdf",
      "",
      conflictStrategy,
    )
    return pdfFile
  }
}
