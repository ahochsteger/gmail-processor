import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { ThreadContext } from "../Context"
import {
  ActionArgsType,
  ActionFunction,
  ActionProvider,
  ActionReturnType,
} from "./ActionRegistry"

export class ThreadActions implements ActionProvider<ThreadContext> {
  [key: string]: ActionFunction<ThreadContext>
  public markProcessed(
    context: ThreadContext,
    _args: ActionArgsType = {},
  ): ActionReturnType {
    let thread
    if (context.config.settings.processedMode == "label") {
      thread = this.addLabel(context, {
        name: context.config.settings.processedLabel,
      })
    }
    return { thread }
  }

  public markImportant(context: ThreadContext): ActionReturnType {
    return {
      thread: context.gmailAdapter.threadMarkImportant(context.thread),
    }
  }

  public markRead(context: ThreadContext): ActionReturnType {
    return {
      thread: context.gmailAdapter.threadMarkRead(context.thread),
    }
  }

  public markUnimportant(context: ThreadContext): ActionReturnType {
    return {
      thread: context.gmailAdapter.threadMarkUnimportant(context.thread),
    }
  }

  public markUnread(context: ThreadContext): ActionReturnType {
    return {
      thread: context.gmailAdapter.threadMarkUnread(context.thread),
    }
  }

  public moveToArchive(context: ThreadContext): ActionReturnType {
    return {
      thread: context.gmailAdapter.threadMoveToArchive(context.thread),
    }
  }

  public moveToInbox(context: ThreadContext): ActionReturnType {
    return {
      thread: context.gmailAdapter.threadMoveToInbox(context.thread),
    }
  }

  public moveToSpam(context: ThreadContext): ActionReturnType {
    return {
      thread: context.gmailAdapter.threadMoveToSpam(context.thread),
    }
  }

  public moveToTrash(context: ThreadContext): ActionReturnType {
    return {
      thread: context.gmailAdapter.threadMoveToTrash(context.thread),
    }
  }

  public addLabel(context: ThreadContext, args: ActionArgsType) {
    return {
      thread: context.gmailAdapter.threadAddLabel(
        context.thread,
        args.name as string,
      ),
    }
  }

  public removeLabel(context: ThreadContext, args: ActionArgsType) {
    return {
      thread: context.gmailAdapter.threadRemoveLabel(
        context.thread,
        args.name as string,
      ),
    }
  }

  /**
   * Generate a PDF document for the whole thread and store it to GDrive.
   */
  public storeAsPdfToGDrive(
    context: ThreadContext,
    args: ActionArgsType,
    // {
    //   location: string
    //   conflictStrategy: ConflictStrategy
    //   skipHeader: boolean
    // }
  ) {
    return {
      ok: true,
      file: context.gdriveAdapter.createFile(
        args.location as string,
        context.gmailAdapter.threadAsPdf(
          context.thread,
          args.skipHeader as boolean,
        ),
        "application/pdf",
        "",
        args.conflictStrategy as ConflictStrategy,
      ),
    }
  }
}
