import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { MessageContext } from "../Context"
import { ActionArgsType, ActionProvider } from "./ActionRegistry"

export class MessageActions extends ActionProvider {
  public forward(
    context: MessageContext,
    args: ActionArgsType & { to: string },
  ) {
    return {
      message: context.gmailAdapter.messageForward(context.message, args.to),
    }
  }

  public markProcessed(context: MessageContext) {
    let message
    if (context.config.settings.processedMode == "read") {
      message = context.gmailAdapter.messageMarkRead(context.message)
    }
    return { message }
  }

  public markRead(context: MessageContext) {
    return { message: context.gmailAdapter.messageMarkRead(context.message) }
  }

  public markUnread(context: MessageContext) {
    return { message: context.gmailAdapter.messageMarkUnread(context.message) }
  }

  public moveToTrash(context: MessageContext) {
    return { message: context.gmailAdapter.messageMoveToTrash(context.message) }
  }

  public star(context: MessageContext) {
    return { message: context.gmailAdapter.messageStar(context.message) }
  }

  public unstar(context: MessageContext) {
    return { message: context.gmailAdapter.messageUnstar(context.message) }
  }

  /**
   * Generate a PDF document from the message and store it to GDrive.
   */
  public storeAsPdfToGDrive(
    context: MessageContext,
    args: ActionArgsType & {
      location: string
      conflictStrategy: ConflictStrategy
      skipHeader: boolean
    },
  ) {
    return {
      file: context.gdriveAdapter.createFile(
        args.location,
        context.gmailAdapter.messageAsPdf(context.message, args.skipHeader),
        "application/pdf",
        "",
        args.conflictStrategy,
      ),
    }
  }
}
