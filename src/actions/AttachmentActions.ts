import { ProcessingContext } from "../context/ProcessingContext"
import { ConflictStrategy, GDriveAdapter } from "../adapter/GDriveAdapter"
import { AbstractActions } from "./AbstractActions"
import { action, actionProvider } from "./ActionRegistry"
import "reflect-metadata"

@actionProvider("attachment")
export class AttachmentActions extends AbstractActions {
  private attachment: GoogleAppsScript.Gmail.GmailAttachment
  constructor(
    context: ProcessingContext,
    logger: Console = console,
    dryRun = false,
  ) {
    super(context, logger, dryRun)
    this.attachment = context.attachmentContext!.attachment!
  }

  @action("attachment.storeToGDrive")
  public storeToGDrive(
    location: string,
    conflictStrategy: ConflictStrategy,
    description: string,
  ) {
    const gdriveAdapter = new GDriveAdapter(this.logger, this.dryRun, this.context.gasContext.gdriveApp)
    if (
      this.checkDryRun(
        `Storing attachment '${this.attachment.getName()}' to '${location}' ...`,
      )
    )
      return
    const file = gdriveAdapter.storeAttachment(
      this.attachment,
      location,
      conflictStrategy,
      description,
    )
    return file
  }
}
