import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { MessageContext } from "../Context"
import { destructiveAction, writingAction } from "../utils/Decorators"
import { PatternUtil } from "../utils/PatternUtil"
import {
  ActionFunction,
  ActionProvider,
  ActionReturnType,
} from "./ActionRegistry"

export class MessageActions implements ActionProvider<MessageContext> {
  [key: string]: ActionFunction<MessageContext>

  @writingAction()
  public static forward<TArgs extends { to: string }>(
    context: MessageContext,
    args: TArgs,
  ): ActionReturnType {
    return {
      message: context.proc.gmailAdapter.messageForward(
        context.message.object,
        args.to as string,
      ),
    }
  }

  @writingAction()
  public static markRead(context: MessageContext) {
    return {
      message: context.proc.gmailAdapter.messageMarkRead(
        context.message.object,
      ),
    }
  }

  @writingAction()
  public static markUnread(context: MessageContext) {
    return {
      message: context.proc.gmailAdapter.messageMarkUnread(
        context.message.object,
      ),
    }
  }

  @destructiveAction()
  public static moveToTrash(context: MessageContext) {
    return {
      message: context.proc.gmailAdapter.messageMoveToTrash(
        context.message.object,
      ),
    }
  }

  @writingAction()
  public static star(context: MessageContext) {
    return {
      message: context.proc.gmailAdapter.messageStar(context.message.object),
    }
  }

  @writingAction()
  public static unstar(context: MessageContext) {
    return {
      message: context.proc.gmailAdapter.messageUnstar(context.message.object),
    }
  }

  /**
   * Generate a PDF document from the message and store it to GDrive.
   */
  @writingAction()
  public static storePDF<
    TArgs extends {
      location: string
      conflictStrategy: ConflictStrategy
      description?: string
      skipHeader: boolean
    },
  >(context: MessageContext, args: TArgs) {
    return {
      file: context.proc.gdriveAdapter.createFile(
        PatternUtil.substitute(context, args.location),
        {
          content: context.proc.gmailAdapter.messageAsPdf(
            context.message.object,
            args.skipHeader as boolean,
          ),
          mimeType: "application/pdf",
          description: PatternUtil.substitute(context, args.description || ""),
        },
        args.conflictStrategy as ConflictStrategy,
      ),
    }
  }
}

type MethodNames<T> = keyof T
type MessageActionMethodNames = Exclude<
  MethodNames<typeof MessageActions>,
  "prototype"
>
export type MessageActionNames = `message.${MessageActionMethodNames}` | ""
