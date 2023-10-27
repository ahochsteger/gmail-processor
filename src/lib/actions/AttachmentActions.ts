import { ActionBaseConfig, StoreActionBaseArgs } from "../config/ActionConfig"
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

  /** Do nothing (no operation). Used for testing. */
  public static noop(context: AttachmentContext) {
    context.log.info("NOOP: Do nothing.")
  }

  /** Store an attachment to a Google Drive location. */
  @writingAction<AttachmentContext>()
  public static store(
    context: AttachmentContext,
    args: StoreActionBaseArgs,
  ): ActionReturnType & { file: GoogleAppsScript.Drive.File } {
    const file = context.proc.gdriveAdapter.storeAttachment(
      context.attachment.object,
      PatternUtil.substitute(context, args.location),
      args.conflictStrategy,
      PatternUtil.substitute(context, args.description ?? ""),
    )
    return {
      ok: true,
      file: file,
    }
  }
}

export type AttachmentActionConfigType =
  | ActionBaseConfig<"attachment.noop">
  | ActionBaseConfig<"attachment.store", StoreActionBaseArgs>
