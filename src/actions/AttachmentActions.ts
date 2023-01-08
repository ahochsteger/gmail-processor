import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { AbstractActions } from "./AbstractActions"
import { action } from "./ActionRegistry"
import { AttachmentContext } from "../context/AttachmentContext"

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
    return this.processingContext.gdriveAdapter.storeAttachment(
      this.attachmentContext.attachment,
      location,
      conflictStrategy,
      description,
    )
  }
}
