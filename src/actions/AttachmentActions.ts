import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { AttachmentContext } from "../Context"
import {
  ActionArgsType,
  ActionFunction,
  ActionProvider,
  ActionReturnType,
} from "./ActionRegistry"

export class AttachmentActions implements ActionProvider<AttachmentContext> {
  [key: string]: ActionFunction<AttachmentContext>
  public storeToGDrive(
    context: AttachmentContext,
    args: ActionArgsType,
    // {
    //   location: string
    //   conflictStrategy: ConflictStrategy
    //   description: string
    // },
  ): ActionReturnType & { gdriveFile: GoogleAppsScript.Drive.File } {
    const gdriveFile = context.gdriveAdapter.storeAttachment(
      context.attachment,
      args.location as string,
      args.conflictStrategy as ConflictStrategy,
      args.description as string,
    )
    return {
      ok: true,
      gdriveFile,
    }
  }
}
