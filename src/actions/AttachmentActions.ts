import "reflect-metadata"
import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { AbstractActions } from "./AbstractActions"
import { action, actionProvider } from "./ActionRegistry"
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
    return this.processingContext.gasContext.gdriveAdapter.storeAttachment(
      this.attachmentContext.attachment,
      location,
      conflictStrategy,
      description,
    )
  }
}
