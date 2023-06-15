import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { AttachmentContext } from "../Context"
import { writingAction } from "../utils/Decorators"
import { PatternUtil } from "../utils/PatternUtil"
import {
  ActionFunction,
  ActionProvider,
  ActionReturnType,
} from "./ActionRegistry"

export class AttachmentActions implements ActionProvider<AttachmentContext> {
  [key: string]: ActionFunction<AttachmentContext>
  @writingAction<AttachmentContext>()
  public static storeToGDrive<
    TArgs extends {
      location: string
      conflictStrategy: ConflictStrategy
      description?: string
    },
  >(
    context: AttachmentContext,
    args: TArgs,
  ): ActionReturnType & { gdriveFile: GoogleAppsScript.Drive.File } {
    const gdriveFile = context.proc.gdriveAdapter.storeAttachment(
      context.attachment.object,
      PatternUtil.substitute(context, args.location),
      args.conflictStrategy,
      PatternUtil.substitute(context, args.description || ""),
    )
    return {
      ok: true,
      gdriveFile,
    }
  }
}

type MethodNames<T> = keyof T
type AttachmentActionMethodNames = Exclude<
  MethodNames<typeof AttachmentActions>,
  "prototype"
>
export type AttachmentActionNames =
  | `attachment.${AttachmentActionMethodNames}`
  | ""
