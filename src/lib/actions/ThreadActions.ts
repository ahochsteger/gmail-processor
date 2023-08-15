import { ConflictStrategy, FileContent } from "../adapter/GDriveAdapter"
import { ThreadContext } from "../Context"
import { destructiveAction, writingAction } from "../utils/Decorators"
import { PatternUtil } from "../utils/PatternUtil"
import {
  ActionFunction,
  ActionProvider,
  ActionReturnType,
} from "./ActionRegistry"

export class ThreadActions implements ActionProvider<ThreadContext> {
  [key: string]: ActionFunction<ThreadContext>

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
  public static addLabel<
    TArgs extends {
      /** The name of the label. */
      name: string
    },
  >(context: ThreadContext, args: TArgs) {
    return {
      thread: context.proc.gmailAdapter.threadAddLabel(
        context.thread.object,
        args.name,
      ),
    }
  }

  /** Remove a label from the thread. */
  @writingAction()
  public static removeLabel<
    TArgs extends {
      /** The name of the label. */
      name: string
    },
  >(context: ThreadContext, args: TArgs) {
    return {
      thread: context.proc.gmailAdapter.threadRemoveLabel(
        context.thread.object,
        args.name,
      ),
    }
  }

  /** Generate a PDF document for the whole thread and store it to GDrive. */
  @writingAction()
  public static storePDF<
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
      /** Skip the header if `true`. */
      skipHeader?: boolean
    },
  >(context: ThreadContext, args: TArgs) {
    return {
      ok: true,
      file: context.proc.gdriveAdapter.createFile(
        PatternUtil.substitute(context, args.location),
        new FileContent(
          context.proc.gmailAdapter.threadAsPdf(
            context.thread.object,
            args.skipHeader,
          ),
          PatternUtil.substitute(context, args.description || ""),
        ),
        args.conflictStrategy,
      ),
    }
  }
}

type MethodNames<T> = keyof T
type ThreadActionMethodNames = Exclude<
  MethodNames<typeof ThreadActions>,
  "prototype"
>
export type ThreadActionNames = `thread.${ThreadActionMethodNames}` | ""
