import { ProcessingContext } from "../context/ProcessingContext"
import { ConflictStrategy, GDriveAdapter } from "../adapter/GDriveAdapter"
import { AbstractActionProvider } from "./AbstractActionProvider"

export class ThreadActionProvider extends AbstractActionProvider {
  constructor(
    context: ProcessingContext,
    logger: Console = console,
    dryRun = false,
    private thread: GoogleAppsScript.Gmail.GmailThread,
  ) {
    super(context, logger, dryRun)
  }

  markAsProcessed() {
    if (this.context.config.settings.processedMode == "label") {
      if (this.checkDryRun(`Marking thread '${this.thread.getFirstMessageSubject()}' as processed ...`)) return
      this.addLabel(this.context.config.settings.processedLabel)
    }
  }

  markImportant() {
    if (this.checkDryRun(`Marking thread '${this.thread.getFirstMessageSubject()}' as important ...`)) return
    this.thread.markImportant()
  }

  markRead() {
    if (this.checkDryRun(`Marking thread '${this.thread.getFirstMessageSubject()}' as read ...`)) return
    this.thread.markRead()
  }

  markUnimportant() {
    if (this.checkDryRun(`Marking thread '${this.thread.getFirstMessageSubject()}' as unimportant ...`)) return
    this.thread.markUnimportant()
  }

  markUnread() {
    if (this.checkDryRun(`Marking thread '${this.thread.getFirstMessageSubject()}' as unread ...`)) return
    this.thread.markUnread()
  }

  moveToArchive() {
    if (this.checkDryRun(`Moving thread '${this.thread.getFirstMessageSubject()}' to archive ...`)) return
    this.thread.moveToArchive()
  }

  moveToInbox() {
    if (this.checkDryRun(`Moving thread '${this.thread.getFirstMessageSubject()}' to inbox ...`)) return
    this.thread.moveToInbox()
  }

  moveToSpam() {
    if (this.checkDryRun(`Moving thread '${this.thread.getFirstMessageSubject()}' to spam ...`)) return
    this.thread.moveToSpam()
  }

  moveToTrash() {
    if (this.checkDryRun(`Moving thread '${this.thread.getFirstMessageSubject()}' to trash ...`)) return
    this.thread.moveToTrash()
  }

  addLabel(labelName: string) {
    if (this.checkDryRun(`Adding label '${labelName}' to thread '${this.thread.getFirstMessageSubject()}' ...`)) return
    if (labelName !== "") {
      const label = this.context.gasContext.gmailApp.getUserLabelByName(labelName)
      this.thread.addLabel(label)
    }
  }

  removeLabel(labelName: string) {
    if (this.checkDryRun(`Removing label '${labelName}' from thread '${this.thread.getFirstMessageSubject()}' ...`)) return
    if (labelName !== "") {
      const label = this.context.gasContext.gmailApp.getUserLabelByName(labelName)
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
  public storeAsPdfToGDrive(
    gdriveApp: GoogleAppsScript.Drive.DriveApp,
    location: string,
    conflictStrategy: ConflictStrategy,
  ) {
    const html = this.processThreadToHtml(this.thread)
    const htmlBlob = Utilities.newBlob(html, "text/html")
    const gdriveAdapter: GDriveAdapter = new GDriveAdapter(gdriveApp)
    if (this.checkDryRun(`Saving PDF copy of thread '${this.thread.getFirstMessageSubject()}' to '${location}' ...`)) return
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
