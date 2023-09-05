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

  /** Store an attachment at a Google Drive location. */
  @writingAction<AttachmentContext>()
  public static store<
    TArgs extends {
      /** The location (path + filename) of the Google Drive file.
       * For shared folders or Team Drives prepend the location with `{id:<folderId>}`.
       * Supports context substitution placeholder.
       */
      location: string
      /**
       * The strategy to be used in case a file already exists at the desired location.
       */
      conflictStrategy: ConflictStrategy
      /**
       * The description to be attached to the Google Drive file.
       * Supports context substitution placeholder.
       */
      description?: string
    },
  >(
    context: AttachmentContext,
    args: TArgs,
  ): ActionReturnType & { file: GoogleAppsScript.Drive.File } {
    const file = context.proc.gdriveAdapter.storeAttachment(
      context.attachment.object,
      PatternUtil.substitute(context, args.location),
      args.conflictStrategy || ConflictStrategy.KEEP,
      PatternUtil.substitute(context, args.description || ""),
    )
    return {
      ok: true,
      file: file,
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
