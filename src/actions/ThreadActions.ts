import { ConflictStrategy, GDriveAdapter } from "../adapter/GDriveAdapter"
import { AbstractActions } from "./AbstractActions"
import { action, actionProvider } from "./ActionRegistry"
import "reflect-metadata"
import { ThreadContext } from "../context/ThreadContext"

@actionProvider("thread")
export class ThreadActions extends AbstractActions {
  constructor(public threadContext: ThreadContext) {
    super(threadContext)
  }

  @action("thread.markProcessed")
  public markProcessed() {
    if (this.processingContext.config.settings.processedMode == "label") {
      if (
        this.checkDryRun(
          `Marking thread '${this.threadContext.thread.getFirstMessageSubject()}' as processed ...`,
        )
      )
        return
      this.addLabel(this.processingContext.config.settings.processedLabel)
    }
  }

  @action("thread.markImportant")
  public markImportant() {
    if (
      this.checkDryRun(
        `Marking thread '${this.threadContext.thread.getFirstMessageSubject()}' as important ...`,
      )
    )
      return
    this.threadContext.thread.markImportant()
  }

  @action("thread.markRead")
  public markRead() {
    if (
      this.checkDryRun(
        `Marking thread '${this.threadContext.thread.getFirstMessageSubject()}' as read ...`,
      )
    )
      return
    this.threadContext.thread.markRead()
  }

  @action("thread.markUnimportant")
  public markUnimportant() {
    if (
      this.checkDryRun(
        `Marking thread '${this.threadContext.thread.getFirstMessageSubject()}' as unimportant ...`,
      )
    )
      return
    this.threadContext.thread.markUnimportant()
  }

  @action("thread.markUnread")
  public markUnread() {
    if (
      this.checkDryRun(
        `Marking thread '${this.threadContext.thread.getFirstMessageSubject()}' as unread ...`,
      )
    )
      return
    this.threadContext.thread.markUnread()
  }

  @action("thread.moveToArchive")
  public moveToArchive() {
    if (
      this.checkDryRun(
        `Moving thread '${this.threadContext.thread.getFirstMessageSubject()}' to archive ...`,
      )
    )
      return
    this.threadContext.thread.moveToArchive()
  }

  @action("thread.moveToInbox")
  public moveToInbox() {
    if (
      this.checkDryRun(
        `Moving thread '${this.threadContext.thread.getFirstMessageSubject()}' to inbox ...`,
      )
    )
      return
    this.threadContext.thread.moveToInbox()
  }

  @action("thread.moveToSpam")
  public moveToSpam() {
    if (
      this.checkDryRun(
        `Moving thread '${this.threadContext.thread.getFirstMessageSubject()}' to spam ...`,
      )
    )
      return
    this.threadContext.thread.moveToSpam()
  }

  @action("thread.moveToTrash")
  public moveToTrash() {
    if (
      this.checkDryRun(
        `Moving thread '${this.threadContext.thread.getFirstMessageSubject()}' to trash ...`,
      )
    )
      return
    this.threadContext.thread.moveToTrash()
  }

  @action("thread.addLabel")
  public addLabel(labelName: string) {
    if (
      this.checkDryRun(
        `Adding label '${labelName}' to thread '${this.threadContext.thread.getFirstMessageSubject()}' ...`,
      )
    )
      return
    if (labelName !== "") {
      const label =
        this.processingContext.gasContext.gmailApp.getUserLabelByName(labelName)
      this.threadContext.thread.addLabel(label)
    }
  }

  @action("thread.removeLabel")
  public removeLabel(labelName: string) {
    if (
      this.checkDryRun(
        `Removing label '${labelName}' from thread '${this.threadContext.thread.getFirstMessageSubject()}' ...`,
      )
    )
      return
    if (labelName !== "") {
      const label =
        this.processingContext.gasContext.gmailApp.getUserLabelByName(labelName)
      this.threadContext.thread.removeLabel(label)
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
    const html = this.processThreadToHtml(this.threadContext.thread)
    const htmlBlob = Utilities.newBlob(html, "text/html")
    const gdriveAdapter: GDriveAdapter = new GDriveAdapter(
      this.logger,
      this.processingContext.config.settings.dryRun,
      gdriveApp,
    ) // TODO: Don't instanciate here - get from context
    if (
      this.checkDryRun(
        `Saving PDF copy of thread '${this.threadContext.thread.getFirstMessageSubject()}' to '${location}' ...`,
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
