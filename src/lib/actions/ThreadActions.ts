import { FileContent } from "../adapter/GDriveAdapter"
import { ExportOptionsType } from "../adapter/GmailExportAdapter"
import { ActionBaseConfig, StoreActionBaseArgs } from "../config/ActionConfig"
import { ThreadContext } from "../Context"
import { destructiveAction, writingAction } from "../utils/Decorators"
import { PatternUtil } from "../utils/PatternUtil"
import {
  ActionFunction,
  ActionProvider,
  ActionReturnType,
} from "./ActionRegistry"

export type ThreadActionLabelArgs = {
  /** The name of the label. */
  name: string
}

type ThreadActionConfigLabel<TName extends string = string> = ActionBaseConfig<
  TName,
  ThreadActionLabelArgs
>

export type ThreadActionExportArgs = StoreActionBaseArgs & ExportOptionsType
type ThreadActionConfigExport<TName extends string = string> = ActionBaseConfig<
  TName,
  ThreadActionExportArgs
>

export type ThreadActionArgsStorePDF = StoreActionBaseArgs & {
  /** Skip the header if `true`. */
  skipHeader?: boolean
}
type ThreadActionConfigStorePDF<TName extends string = string> =
  ActionBaseConfig<TName, ThreadActionArgsStorePDF>

export class ThreadActions implements ActionProvider<ThreadContext> {
  [key: string]: ActionFunction<ThreadContext>

  /** Do nothing (no operation). Used for testing. */
  public static noop(context: ThreadContext) {
    context.log.info("NOOP: Do nothing.")
  }

  /** Mark the thread as important. */
  @writingAction()
  public static markImportant(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMarkImportant(
        context.thread.object,
      ),
    }
  }

  /** Mark the thread as read. */
  @writingAction()
  public static markRead(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMarkRead(context.thread.object),
    }
  }

  /** Mark the thread as unimportant. */
  @writingAction()
  public static markUnimportant(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMarkUnimportant(
        context.thread.object,
      ),
    }
  }

  /** Mark the thread as unread. */
  @writingAction()
  public static markUnread(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMarkUnread(context.thread.object),
    }
  }

  /** Move the thread to the archive. */
  @writingAction()
  public static moveToArchive(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMoveToArchive(
        context.thread.object,
      ),
    }
  }

  /** Move the thread to the inbox. */
  @writingAction()
  public static moveToInbox(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMoveToInbox(
        context.thread.object,
      ),
    }
  }

  /** Move the thread to spam. */
  @writingAction()
  public static moveToSpam(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMoveToSpam(context.thread.object),
    }
  }

  /** Move the thread to trash. */
  @destructiveAction()
  public static moveToTrash(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMoveToTrash(
        context.thread.object,
      ),
    }
  }

  /** Add a label to the thread. */
  @writingAction()
  public static addLabel(context: ThreadContext, args: ThreadActionLabelArgs) {
    return {
      thread: context.proc.gmailAdapter.threadAddLabel(
        context.thread.object,
        args.name,
      ),
    }
  }

  /** Remove a label from the thread. */
  @writingAction()
  public static removeLabel(
    context: ThreadContext,
    args: ThreadActionLabelArgs,
  ) {
    return {
      thread: context.proc.gmailAdapter.threadRemoveLabel(
        context.thread.object,
        args.name,
      ),
    }
  }

  /** Export a thread as HTML document and store it to a GDrive location. */
  @writingAction()
  public static exportAsHtml(
    context: ThreadContext,
    args: ThreadActionExportArgs,
  ) {
    const name = `${context.thread.object.getFirstMessageSubject()}.html`
    return {
      ok: true,
      file: context.proc.gdriveAdapter.createFile(
        PatternUtil.substitute(context, args.location),
        new FileContent(
          context.proc.gmailAdapter.threadAsHtml(
            context.thread.object,
            name,
            args,
          ),
          name,
          PatternUtil.substitute(context, args.description ?? ""),
        ),
        args.conflictStrategy,
      ),
    }
  }

  /** Export a thread as PDF document and store it to a GDrive location. */
  @writingAction()
  public static exportAsPdf(
    context: ThreadContext,
    args: ThreadActionExportArgs,
  ) {
    const name = `${context.thread.object.getFirstMessageSubject()}.pdf`
    return {
      ok: true,
      file: context.proc.gdriveAdapter.createFile(
        PatternUtil.substitute(context, args.location),
        new FileContent(
          context.proc.gmailAdapter.threadAsPdf(
            context.thread.object,
            name,
            args,
          ),
          name,
          PatternUtil.substitute(context, args.description ?? ""),
        ),
        args.conflictStrategy,
      ),
    }
  }

  /**
   * Generate a PDF document for the whole thread and store it to GDrive.
   * @deprecated Use `thread.exportAsPdf` instead.
   */
  @writingAction()
  public static storePDF(
    context: ThreadContext,
    args: ThreadActionArgsStorePDF,
  ) {
    const name = `${context.thread.object.getFirstMessageSubject()}.pdf`
    return {
      ok: true,
      file: context.proc.gdriveAdapter.createFile(
        PatternUtil.substitute(context, args.location),
        new FileContent(
          context.proc.gmailAdapter.threadAsPdf(context.thread.object, name, {
            includeHeader: !(args.skipHeader ?? false),
          }),
          name,
          PatternUtil.substitute(context, args.description ?? ""),
        ),
        args.conflictStrategy,
      ),
    }
  }
}

export type ThreadActionConfigType =
  | ActionBaseConfig<"thread.noop">
  | ThreadActionConfigLabel<"thread.addLabel">
  | ThreadActionConfigExport<"thread.exportAsHtml">
  | ThreadActionConfigExport<"thread.exportAsPdf">
  | ThreadActionConfigLabel<"thread.removeLabel">
  | ThreadActionConfigStorePDF<"thread.storePDF">
  | ActionBaseConfig<"thread.markImportant">
  | ActionBaseConfig<"thread.markRead">
  | ActionBaseConfig<"thread.markUnimportant">
  | ActionBaseConfig<"thread.markUnread">
  | ActionBaseConfig<"thread.moveToArchive">
  | ActionBaseConfig<"thread.moveToInbox">
  | ActionBaseConfig<"thread.moveToSpam">
  | ActionBaseConfig<"thread.moveToTrash">
