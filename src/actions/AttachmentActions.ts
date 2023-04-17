import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { AttachmentContext } from "../Context"
import {
  ActionArgsType,
  ActionFunction,
  ActionProvider,
  ActionReturnType,
  typedArgs,
} from "./ActionRegistry"

export class AttachmentActions implements ActionProvider<AttachmentContext> {
  [key: string]: ActionFunction<AttachmentContext>
  public storeToGDrive<
    T extends {
      location: string
      conflictStrategy: ConflictStrategy
      description: string
    },
  >(
    context: AttachmentContext,
    args: ActionArgsType,
  ): ActionReturnType & { gdriveFile: GoogleAppsScript.Drive.File } {
    const a = typedArgs<T>(args)
    const gdriveFile = context.gdriveAdapter.storeAttachment(
      context.attachment,
      a.location as string,
      a.conflictStrategy as ConflictStrategy,
      a.description as string,
    )
    return {
      ok: true,
      gdriveFile,
    }
  }
}
