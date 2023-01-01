import { ConflictStrategy, GDriveAdapter } from "../adapter/GDriveAdapter"
import { AbstractActions } from "./AbstractActions"
import { action, actionProvider } from "./ActionRegistry"
import "reflect-metadata"
import { AttachmentContext } from "../context/AttachmentContext"

@actionProvider("attachment")
export class AttachmentActions extends AbstractActions {
  constructor(protected attachmentContext: AttachmentContext) {
    super(attachmentContext)
  }

  @action("attachment.storeToGDrive")
  public storeToGDrive(
    location: string,
    conflictStrategy: ConflictStrategy,
    description: string,
  ) {
    const gdriveAdapter = new GDriveAdapter(
      this.logger,
      this.processingContext.config.settings.dryRun,
      this.processingContext.gasContext.gdriveApp,
    )
    if (
      this.checkDryRun(
        `Storing attachment '${this.attachmentContext.attachment.getName()}' to '${location}' ...`,
      )
    )
      return
    const file = gdriveAdapter.storeAttachment(
      this.attachmentContext.attachment,
      location,
      conflictStrategy,
      description,
    )
    return file
  }
}
