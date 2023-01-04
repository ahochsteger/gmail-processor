import "reflect-metadata"
import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { AbstractActions } from "./AbstractActions"
import { action, actionProvider } from "./ActionRegistry"
import { ThreadContext } from "../context/ThreadContext"
import { GmailAdapter } from "../adapter/GmailAdapter"

@actionProvider("thread")
export class ThreadActions extends AbstractActions {
  private gmailAdapter: GmailAdapter
  private thread: GoogleAppsScript.Gmail.GmailThread
  constructor(public threadContext: ThreadContext) {
    super(threadContext)
    this.gmailAdapter = threadContext.gasContext.gmailAdapter
    this.thread = threadContext.thread
  }

  @action("thread.markProcessed")
  public markProcessed() {
    if (this.processingContext.config.settings.processedMode == "label") {
      this.addLabel(this.processingContext.config.settings.processedLabel)
    }
  }

  @action("thread.markImportant")
  public markImportant() {
    return this.gmailAdapter.threadMarkImportant(this.thread)
  }

  @action("thread.markRead")
  public markRead() {
    return this.gmailAdapter.threadMarkRead(this.thread)
  }

  @action("thread.markUnimportant")
  public markUnimportant() {
    return this.gmailAdapter.threadMarkUnimportant(this.thread)
  }

  @action("thread.markUnread")
  public markUnread() {
    return this.gmailAdapter.threadMarkUnread(this.thread)
  }

  @action("thread.moveToArchive")
  public moveToArchive() {
    return this.gmailAdapter.threadMoveToArchive(this.thread)
  }

  @action("thread.moveToInbox")
  public moveToInbox() {
    return this.gmailAdapter.threadMoveToInbox(this.thread)
  }

  @action("thread.moveToSpam")
  public moveToSpam() {
    return this.gmailAdapter.threadMoveToSpam(this.thread)
  }

  @action("thread.moveToTrash")
  public moveToTrash() {
    return this.gmailAdapter.threadMoveToTrash(this.thread)
  }

  @action("thread.addLabel")
  public addLabel(labelName: string) {
    return this.gmailAdapter.threadAddLabel(this.thread, labelName)
  }

  @action("thread.removeLabel")
  public removeLabel(labelName: string) {
    return this.gmailAdapter.threadRemoveLabel(this.thread, labelName)
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
    return this.processingContext.gasContext.gdriveAdapter.createFile(
      location,
      this.gmailAdapter.threadAsPdf(this.threadContext.thread),
      "application/pdf",
      "",
      conflictStrategy,
    )
  }
}
