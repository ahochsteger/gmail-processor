import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { AttachmentContext } from "../Context"
import {
  ActionArgsType,
  ActionProvider,
  ActionReturnType,
} from "./ActionRegistry"

export class AttachmentActions extends ActionProvider {
  public storeToGDrive(
    context: AttachmentContext,
    args: ActionArgsType & {
      location: string
      conflictStrategy: ConflictStrategy
      description: string
    },
  ): ActionReturnType & { gdriveFile: GoogleAppsScript.Drive.File } {
    const gdriveFile = context.gdriveAdapter.storeAttachment(
      context.attachment,
      args.location,
      args.conflictStrategy,
      args.description,
    )
    return {
      ok: true,
      gdriveFile,
    }
  }
}
