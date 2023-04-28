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
    if (context.config.settings.processedMode == "label") {
      thread = this.addLabel(context, {
        name: context.config.settings.processedLabel,
      })
    }
    return { thread }
  }

  public static markImportant(context: ThreadContext): ActionReturnType {
    return {
      thread: context.gmailAdapter.threadMarkImportant(context.thread),
    }
  }

  public static markRead(context: ThreadContext): ActionReturnType {
    return {
      thread: context.gmailAdapter.threadMarkRead(context.thread),
    }
  }

  public static markUnimportant(context: ThreadContext): ActionReturnType {
    return {
      thread: context.gmailAdapter.threadMarkUnimportant(context.thread),
    }
  }

  public static markUnread(context: ThreadContext): ActionReturnType {
    return {
      thread: context.gmailAdapter.threadMarkUnread(context.thread),
    }
  }

  public static moveToArchive(context: ThreadContext): ActionReturnType {
    return {
      thread: context.gmailAdapter.threadMoveToArchive(context.thread),
    }
  }

  public static moveToInbox(context: ThreadContext): ActionReturnType {
    return {
      thread: context.gmailAdapter.threadMoveToInbox(context.thread),
    }
  }

  public static moveToSpam(context: ThreadContext): ActionReturnType {
    return {
      thread: context.gmailAdapter.threadMoveToSpam(context.thread),
    }
  }

  public static moveToTrash(context: ThreadContext): ActionReturnType {
    return {
      thread: context.gmailAdapter.threadMoveToTrash(context.thread),
    }
  }

  public static addLabel<T extends { name: string }>(
    context: ThreadContext,
    args: ActionArgsType,
  ) {
    const a = typedArgs<T>(args)
    return {
      thread: context.gmailAdapter.threadAddLabel(context.thread, a.name),
    }
  }

  public static removeLabel<T extends { name: string }>(
    context: ThreadContext,
    args: ActionArgsType,
  ) {
    const a = typedArgs<T>(args)
    return {
      thread: context.gmailAdapter.threadRemoveLabel(context.thread, a.name),
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
      file: context.gdriveAdapter.createFile(
        a.location,
        context.gmailAdapter.threadAsPdf(context.thread, a.skipHeader),
        "application/pdf",
        "",
        a.conflictStrategy,
      ),
    }
  }
}
