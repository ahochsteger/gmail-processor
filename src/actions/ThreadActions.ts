import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { ThreadContext } from "../context/ThreadContext"
import {
  ActionArgsType,
  ActionProvider,
  ActionReturnType,
} from "./ActionRegistry"

export class ThreadActions extends ActionProvider {
  public markProcessed(context: ThreadContext): ActionReturnType {
    let thread
    if (context.config.settings.processedMode == "label") {
      thread = this.addLabel(context, {
        name: context.config.settings.processedLabel,
      })
    }
    return { thread }
  }

  public markImportant(context: ThreadContext): ActionReturnType {
    return { thread: context.gmailAdapter.threadMarkImportant(context.thread) }
  }

  public markRead(context: ThreadContext): ActionReturnType {
    return { thread: context.gmailAdapter.threadMarkRead(context.thread) }
  }

  public markUnimportant(context: ThreadContext): ActionReturnType {
    return {
      thread: context.gmailAdapter.threadMarkUnimportant(context.thread),
    }
  }

  public markUnread(context: ThreadContext): ActionReturnType {
    return { thread: context.gmailAdapter.threadMarkUnread(context.thread) }
  }

  public moveToArchive(context: ThreadContext): ActionReturnType {
    return { thread: context.gmailAdapter.threadMoveToArchive(context.thread) }
  }

  public moveToInbox(context: ThreadContext): ActionReturnType {
    return { thread: context.gmailAdapter.threadMoveToInbox(context.thread) }
  }

  public moveToSpam(context: ThreadContext): ActionReturnType {
    return { thread: context.gmailAdapter.threadMoveToSpam(context.thread) }
  }

  public moveToTrash(context: ThreadContext): ActionReturnType {
    return { thread: context.gmailAdapter.threadMoveToTrash(context.thread) }
  }

  public addLabel(
    context: ThreadContext,
    args: ActionArgsType & { name: string },
  ) {
    return {
      thread: context.gmailAdapter.threadAddLabel(context.thread, args.name),
    }
  }

  public removeLabel(
    context: ThreadContext,
    args: ActionArgsType & { name: string },
  ) {
    return {
      thread: context.gmailAdapter.threadRemoveLabel(context.thread, args.name),
    }
  }

  /**
   * Generate a PDF document for the whole thread and store it to GDrive.
   */
  public storeAsPdfToGDrive(
    context: ThreadContext,
    args: {
      location: string
      conflictStrategy: ConflictStrategy
      skipHeader: boolean
    },
  ) {
    return context.gdriveAdapter.createFile(
      args.location,
      context.gmailAdapter.threadAsPdf(context.thread, args.skipHeader),
      "application/pdf",
      "",
      args.conflictStrategy,
    )
  }
}
