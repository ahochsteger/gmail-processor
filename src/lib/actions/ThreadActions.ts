import { ExportOptionsType } from "../adapter/GmailExportAdapter"
import { ActionBaseConfig, StoreActionBaseArgs } from "../config/ActionConfig"
import { ThreadContext } from "../Context"
import { destructiveAction, writingAction } from "../utils/Decorators"
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
    return context.proc.gdriveAdapter.createFileFromAction(
      context,
      args.location,
      context.proc.gmailAdapter.threadAsHtml(context.thread.object, args),
      args.conflictStrategy,
      args.description,
      "exported thread HTML file",
      "thread",
      "thread.exportAsHtml",
    )
  }

  /** Export a thread as PDF document and store it to a GDrive location. */
  @writingAction()
  public static exportAsPdf(
    context: ThreadContext,
    args: ThreadActionExportArgs,
  ) {
    return context.proc.gdriveAdapter.createFileFromAction(
      context,
      args.location,
      context.proc.gmailAdapter.threadAsPdf(context.thread.object, args),
      args.conflictStrategy,
      args.description,
      "exported thread PDF file",
      "thread",
      "thread.exportAsPdf",
    )
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
    return context.proc.gdriveAdapter.createFileFromAction(
      context,
      args.location,
      context.proc.gmailAdapter.threadAsPdf(context.thread.object, {
        includeHeader: !(args.skipHeader ?? false),
      }),
      args.conflictStrategy,
      args.description,
      "exported thread PDF file",
      "thread",
      "thread.storePDF",
    )
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
