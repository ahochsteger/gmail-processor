import { ProcessingContext } from "../context/ProcessingContext"
import { ConflictStrategy, GDriveAdapter } from "../adapter/GDriveAdapter"
import { AbstractActions } from "./AbstractActions"

export class GDriveActions extends AbstractActions {
  constructor(
    context: ProcessingContext,
    logger: Console = console,
    dryRun = false,
    private attachment: GoogleAppsScript.Gmail.GmailAttachment,
  ) {
    super(context, logger, dryRun)
  }

  public storeAttachmentToGDrive(
    gdriveApp: GoogleAppsScript.Drive.DriveApp,
    location: string,
    conflictStrategy: ConflictStrategy,
    description: string,
  ) {
    const gdriveAdapter = new GDriveAdapter(gdriveApp)
    if (
      this.checkDryRun(
        `Storing attachment '${this.attachment.getName()}' to '${location}' ...`,
      )
    )
      return
    const file = gdriveAdapter.createFile(
      location,
      this.attachment.getDataAsString(),
      this.attachment.getContentType(),
      description,
      conflictStrategy,
    )
    return file
  }
}
