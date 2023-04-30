import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { ThreadContext } from "../Context"
import {
  ActionArgsType,
  ActionFunction,
  ActionProvider,
  ActionReturnType,
  typedArgs,
} from "./ActionRegistry"

export class ThreadActions implements ActionProvider<ThreadContext> {
  [key: string]: ActionFunction<ThreadContext>
  public static markProcessed(context: ThreadContext): ActionReturnType {
    let thread
    if (context.proc.config.settings.processedMode == "label") {
      thread = this.addLabel(context, {
        name: context.proc.config.settings.processedLabel,
      })
    }
    return { thread }
  }

  public static markImportant(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMarkImportant(
        context.thread.object,
      ),
    }
  }

  public static markRead(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMarkRead(context.thread.object),
    }
  }

  public static markUnimportant(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMarkUnimportant(
        context.thread.object,
      ),
    }
  }

  public static markUnread(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMarkUnread(context.thread.object),
    }
  }

  public static moveToArchive(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMoveToArchive(
        context.thread.object,
      ),
    }
  }

  public static moveToInbox(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMoveToInbox(
        context.thread.object,
      ),
    }
  }

  public static moveToSpam(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMoveToSpam(context.thread.object),
    }
  }

  public static moveToTrash(context: ThreadContext): ActionReturnType {
    return {
      thread: context.proc.gmailAdapter.threadMoveToTrash(
        context.thread.object,
      ),
    }
  }

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
  public static storeAsPdfToGDrive<
    T extends {
      location: string
      conflictStrategy: ConflictStrategy
      skipHeader?: boolean
    },
  >(context: ThreadContext, args: ActionArgsType) {
    const a = typedArgs<T>(args)
    return {
      ok: true,
      file: context.proc.gdriveAdapter.createFile(
        a.location,
        context.proc.gmailAdapter.threadAsPdf(
          context.thread.object,
          a.skipHeader,
        ),
        "application/pdf",
        "",
        a.conflictStrategy,
      ),
    }
  }
}
