import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { ActionProvider } from "./ActionProvider"
import { Actions } from "./Actions"
import { AttachmentAction } from "./AttachmentAction"

export class GDriveActions implements ActionProvider {
  constructor(public driveApp: GoogleAppsScript.Drive.DriveApp) {}

  public storeAttachmentToGDrive(
    attachment: GoogleAppsScript.Gmail.GmailAttachment,
    args: any,
  ) {
    const location: string = args.location
    const conflictStrategy: ConflictStrategy = args.conflictStrategy
    const description: string = args.description
    // TODO: Implement function (use GDriveAdapter)
    return location + conflictStrategy + description != null
  }

  /**
   * Actions exposed to Gmail2GDrive
   */
  public getActions(): Actions {
    const actions = new Actions()
    actions.set(
      "attachment.storeToGDrive",
      new AttachmentAction(this.storeAttachmentToGDrive),
    )
    return actions
  }
}
