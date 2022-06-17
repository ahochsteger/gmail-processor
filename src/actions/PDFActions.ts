import { ConflictStrategy, GDriveAdapter } from "../adapter/GDriveAdapter"
import { ActionProvider } from "./ActionProvider"
import { Actions } from "./Actions"
import { CommandExecutor } from "./CommandExecutor"
import { ThreadAction } from "./ThreadAction"

export class PDFActions implements ActionProvider, CommandExecutor {
  constructor(public gdriveApp: GoogleAppsScript.Drive.DriveApp) {}

  /**
   * Generate HTML code for one message of a thread.
   */
  public processThreadToHtml(thread: GoogleAppsScript.Gmail.GmailThread) {
    Logger.log(
      "INFO:   Generating HTML code of thread '" +
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
  public processThreadToPdf(
    thread: GoogleAppsScript.Gmail.GmailThread,
    location: string,
    conflictStrategy: ConflictStrategy,
  ) {
    Logger.log(
      "INFO: Saving PDF copy of thread '" +
        thread.getFirstMessageSubject() +
        "' to file +'" +
        location +
        "'",
    )
    const html = this.processThreadToHtml(thread)
    const htmlBlob = Utilities.newBlob(html, "text/html")
    const gdriveAdapter: GDriveAdapter = new GDriveAdapter(this.gdriveApp)
    const pdfFile = gdriveAdapter.createFile(
      location,
      htmlBlob.getAs("application/pdf").getDataAsString(),
      "application/pdf",
      "",
      conflictStrategy,
    )
    return pdfFile
  }

  public exportThreadAsPdfToGDrive(
    thread: GoogleAppsScript.Gmail.GmailThread,
    args: any,
  ) {
    // TODO: Continue here: Adjust to new processing
    this.processThreadToPdf(thread, args.location, args.conflictStrategy)
  }

  /**
   * Actions exposed to Gmail2GDrive
   */
  public getActions(): Actions {
    const actions: Actions = new Actions()
    actions.set(
      "thread.exportAsPdfToGDrive",
      new ThreadAction(this.exportThreadAsPdfToGDrive),
    )
    return actions
  }

  public execute(command: string, gmailObject: any, args: any): void {
    const cmd = this.getActions().get(command)
    if (cmd) {
      cmd.run(gmailObject, args)
    }
  }
}
