import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { AttachmentContext } from "../Context"
import { writingAction } from "../utils/Decorators"
import { PatternUtil } from "../utils/PatternUtil"
import {
  ActionArgsType,
  ActionFunction,
  ActionProvider,
  ActionReturnType,
  typedArgs,
} from "./ActionRegistry"

export class AttachmentActions implements ActionProvider<AttachmentContext> {
  [key: string]: ActionFunction<AttachmentContext>
  @writingAction<AttachmentContext>()
  public static storeToGDrive<
    T extends {
      location: string
      conflictStrategy: ConflictStrategy
      description?: string
    },
  >(
    context: AttachmentContext,
    args: ActionArgsType,
  ): ActionReturnType & { gdriveFile: GoogleAppsScript.Drive.File } {
    const a = typedArgs<T>(args)
    const gdriveFile = context.proc.gdriveAdapter.storeAttachment(
      context.attachment.object,
      PatternUtil.substitute(context, a.location),
      a.conflictStrategy as ConflictStrategy,
      PatternUtil.substitute(context, a.description || ""),
    )
    return {
      ok: true,
      gdriveFile,
    }
  }
}

type MethodNames<T> = keyof T
export type AttachmentActionMethodNames = Exclude<
  MethodNames<typeof AttachmentActions>,
  "prototype"
>
export type AttachmentActionNames =
  | `attachment.${AttachmentActionMethodNames}`
  | ""
