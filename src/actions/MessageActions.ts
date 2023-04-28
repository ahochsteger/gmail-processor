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
      message: context.gmailAdapter.messageForward(
        context.message,
        a.to as string,
      ),
    }
  }

  public static markProcessed(context: MessageContext) {
    let message
    if (context.config.settings.processedMode == "read") {
      message = context.gmailAdapter.messageMarkRead(context.message)
    }
    return { message }
  }

  public static markRead(context: MessageContext) {
    return {
      message: context.gmailAdapter.messageMarkRead(context.message),
    }
  }

  public static markUnread(context: MessageContext) {
    return {
      message: context.gmailAdapter.messageMarkUnread(context.message),
    }
  }

  public static moveToTrash(context: MessageContext) {
    return {
      message: context.gmailAdapter.messageMoveToTrash(context.message),
    }
  }

  public static star(context: MessageContext) {
    return {
      message: context.gmailAdapter.messageStar(context.message),
    }
  }

  public static unstar(context: MessageContext) {
    return {
      message: context.gmailAdapter.messageUnstar(context.message),
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
      file: context.gdriveAdapter.createFile(
        a.location as string,
        context.gmailAdapter.messageAsPdf(
          context.message,
          a.skipHeader as boolean,
        ),
        "application/pdf",
        "",
        a.conflictStrategy as ConflictStrategy,
      ),
    }
  }
}
