import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { MessageContext } from "../Context"
import {
  ActionArgsType,
  ActionFunction,
  ActionProvider,
  typedArgs,
} from "./ActionRegistry"

export class MessageActions implements ActionProvider<MessageContext> {
  [key: string]: ActionFunction<MessageContext>
  public static forward<T extends { to: string }>(
    context: MessageContext,
    args: ActionArgsType,
  ) {
    const a = typedArgs<T>(args)
    return {
      message: context.proc.gmailAdapter.messageForward(
        context.message.object,
        a.to as string,
      ),
    }
  }

  public static markProcessed(context: MessageContext) {
    let message
    if (context.proc.config.settings.processedMode == "read") {
      message = context.proc.gmailAdapter.messageMarkRead(
        context.message.object,
      )
    }
    return { message }
  }

  public static markRead(context: MessageContext) {
    return {
      message: context.proc.gmailAdapter.messageMarkRead(
        context.message.object,
      ),
    }
  }

  public static markUnread(context: MessageContext) {
    return {
      message: context.proc.gmailAdapter.messageMarkUnread(
        context.message.object,
      ),
    }
  }

  public static moveToTrash(context: MessageContext) {
    return {
      message: context.proc.gmailAdapter.messageMoveToTrash(
        context.message.object,
      ),
    }
  }

  public static star(context: MessageContext) {
    return {
      message: context.proc.gmailAdapter.messageStar(context.message.object),
    }
  }

  public static unstar(context: MessageContext) {
    return {
      message: context.proc.gmailAdapter.messageUnstar(context.message.object),
    }
  }

  /**
   * Generate a PDF document from the message and store it to GDrive.
   */
  public static storeAsPdfToGDrive<
    T extends {
      location: string
      conflictStrategy: ConflictStrategy
      skipHeader: boolean
    },
  >(context: MessageContext, args: ActionArgsType) {
    const a = typedArgs<T>(args)
    return {
      file: context.proc.gdriveAdapter.createFile(
        a.location as string,
        context.proc.gmailAdapter.messageAsPdf(
          context.message.object,
          a.skipHeader as boolean,
        ),
        "application/pdf",
        "",
        a.conflictStrategy as ConflictStrategy,
      ),
    }
  }
}
