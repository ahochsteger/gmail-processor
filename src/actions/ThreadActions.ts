import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { AbstractActions, dryRunAware } from "./AbstractActions"
import { action, actionProvider } from "./ActionRegistry"
import "reflect-metadata"
import { ThreadContext } from "../context/ThreadContext"

@actionProvider("thread")
export class ThreadActions extends AbstractActions {
  private gmailAdapter
  private thread
  constructor(public threadContext: ThreadContext) {
    super(threadContext)
    this.gmailAdapter = this.threadContext.gasContext.gmailAdapter
    this.thread = this.threadContext.thread
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
  @dryRunAware()
  public markImportant() {
    return this.thread.markImportant()
  }

  @action("thread.markRead")
  @dryRunAware()
  public markRead() {
    return this.thread.markRead()
  }

  @action("thread.markUnimportant")
  @dryRunAware()
  public markUnimportant() {
    return this.threadContext.thread.markUnimportant()
  }

  @action("thread.markUnread")
  @dryRunAware()
  public markUnread() {
    return this.thread.markUnread()
  }

  @action("thread.moveToArchive")
  @dryRunAware()
  public moveToArchive() {
    return this.thread.moveToArchive()
  }

  @action("thread.moveToInbox")
  @dryRunAware()
  public moveToInbox() {
    return this.thread.moveToInbox()
  }

  @action("thread.moveToSpam")
  @dryRunAware()
  public moveToSpam() {
    return this.thread.moveToSpam()
  }

  @action("thread.moveToTrash")
  @dryRunAware()
  public moveToTrash() {
    return this.thread.moveToTrash()
  }

  @action("thread.addLabel")
  @dryRunAware()
  public addLabel(labelName: string) {
    this.gmailAdapter.threadAddLabel(this.thread, labelName)
  }

  @action("thread.removeLabel")
  @dryRunAware()
  public removeLabel(labelName: string) {
    return this.gmailAdapter.threadRemoveLabel(this.thread, labelName)
  }

  /**
   * Generate a PDF document for the whole thread using HTML from .
   */
  @action("thread.storeAsPdfToGDrive")
  @dryRunAware()
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
