import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { AttachmentContext, MessageContext } from "../Context"
import { writingAction } from "../utils/Decorators"
import {
  ActionArgsType,
  ActionFunction,
  ActionProvider,
  ActionReturnType,
  typedArgs,
} from "./ActionRegistry"

export class MyMessageActions implements ActionProvider<MessageContext> {
  [key: string]: ActionFunction<MessageContext>
  @writingAction()
  public static forward<TArgs extends { to: string }>(
    context: MessageContext,
    args: ActionArgsType,
  ): ActionReturnType {
    const a = typedArgs<TArgs>(args)
    return {
      message: context.proc.gmailAdapter.messageForward(
        context.message.object,
        a.to as string,
      ),
    }
  }
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MyMessageActions
  extends Record<string, ActionFunction<MessageContext>> {}

export class AttachmentActions implements ActionProvider<AttachmentContext> {
  [key: string]: ActionFunction<AttachmentContext>
  @writingAction<AttachmentContext>()
  public static storeToGDrive<
    T extends {
      location: string
      conflictStrategy: ConflictStrategy
      description: string
    },
  >(
    context: AttachmentContext,
    args: ActionArgsType,
  ): ActionReturnType & { gdriveFile: GoogleAppsScript.Drive.File } {
    const a = typedArgs<T>(args)
    const gdriveFile = context.proc.gdriveAdapter.storeAttachment(
      context.attachment.object,
      a.location as string,
      a.conflictStrategy as ConflictStrategy,
      a.description as string,
    )
    return {
      ok: true,
      gdriveFile,
    }
  }
}
