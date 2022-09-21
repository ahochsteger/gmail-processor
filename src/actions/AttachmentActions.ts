import { ProcessingContext } from "../context/ProcessingContext"
import { ConflictStrategy, GDriveAdapter } from "../adapter/GDriveAdapter"
import { AbstractActions } from "./AbstractActions"
import "reflect-metadata"
import { action } from "./ActionRegistry"

export class AttachmentActions extends AbstractActions {
  constructor(
    context: ProcessingContext,
    logger: Console = console,
    dryRun = false,
    private attachment: GoogleAppsScript.Gmail.GmailAttachment,
  ) {
    super(context, logger, dryRun)
  }

  @action("attachment.testAction")
  public testAction(argString: string, argNum: number, argArray: string[], argMap: any) {
    console.log(`argString:${argString}, argNum:${argNum}, argArray:${argArray}, argMap:${argMap}`)
  }
  @action("attachment.storeToGDrive")
  public storeToGDrive(
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
