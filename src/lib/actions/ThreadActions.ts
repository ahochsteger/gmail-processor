import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { ThreadContext } from "../Context"
import { destructiveAction, writingAction } from "../utils/Decorators"
import { PatternUtil } from "../utils/PatternUtil"
import {
  ActionArgsType,
  ActionFunction,
  ActionProvider,
  ActionReturnType,
  typedArgs,
} from "./ActionRegistry"

export class ThreadActions implements ActionProvider<ThreadContext> {
  [key: string]: ActionFunction<ThreadContext>

  @writingAction()
  public static markImportant(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMarkImportant(
        context.thread.object,
      ),
    }
  }

  @writingAction()
  public static markRead(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMarkRead(context.thread.object),
    }
  }

  @writingAction()
  public static markUnimportant(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMarkUnimportant(
        context.thread.object,
      ),
    }
  }

  @writingAction()
  public static markUnread(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMarkUnread(context.thread.object),
    }
  }

  @writingAction()
  public static moveToArchive(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMoveToArchive(
        context.thread.object,
      ),
    }
  }

  @writingAction()
  public static moveToInbox(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMoveToInbox(
        context.thread.object,
      ),
    }
  }

  @writingAction()
  public static moveToSpam(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMoveToSpam(context.thread.object),
    }
  }

  @destructiveAction()
  public static moveToTrash(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMoveToTrash(
        context.thread.object,
      ),
    }
  }

  @writingAction()
  public static addLabel<T extends { name: string }>(
    context: ThreadContext,
    args: ActionArgsType,
  ) {
    const a = typedArgs<T>(args)
    return {
      thread: context.proc.gmailAdapter.threadAddLabel(
        context.thread.object,
        a.name,
      ),
    }
  }

  @writingAction()
  public static removeLabel<T extends { name: string }>(
    context: ThreadContext,
    args: ActionArgsType,
  ) {
    const a = typedArgs<T>(args)
    return {
      thread: context.proc.gmailAdapter.threadRemoveLabel(
        context.thread.object,
        a.name,
      ),
    }
  }

  /**
   * Generate a PDF document for the whole thread and store it to GDrive.
   */
  @writingAction()
  public static storeAsPdfToGDrive<
    T extends {
      location: string
      conflictStrategy: ConflictStrategy
      description?: string
      skipHeader?: boolean
    },
  >(context: ThreadContext, args: ActionArgsType) {
    const a = typedArgs<T>(args)
    return {
      ok: true,
      file: context.proc.gdriveAdapter.createFile(
        PatternUtil.substitute(context, a.location),
        context.proc.gmailAdapter.threadAsPdf(
          context.thread.object,
          a.skipHeader,
        ),
        "application/pdf",
        PatternUtil.substitute(context, a.description || ""),
        a.conflictStrategy,
      ),
    }
  }
}

type MethodNames<T> = keyof T
export type ThreadActionMethodNames = Exclude<
  MethodNames<typeof ThreadActions>,
  "prototype"
>
export type ThreadActionNames = `thread.${ThreadActionMethodNames}` | ""
