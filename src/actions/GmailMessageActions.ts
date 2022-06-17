import { ActionProvider } from "./ActionProvider"
import { Actions } from "./Actions"
import { MessageAction } from "./MessageAction"

export class GmailMessageActions implements ActionProvider {
  /**
   * Actions exposed to Gmail2GDrive
   */
  public getActions(): Actions {
    const actions: Actions = new Actions()
    actions.set(
      "message.forward",
      new MessageAction(
        (message: GoogleAppsScript.Gmail.GmailMessage, args: any) => {
          message.forward(args.to)
        },
      ),
    )
    actions.set(
      "message.markRead",
      new MessageAction(
        (message: GoogleAppsScript.Gmail.GmailMessage, args: any) => {
          message.markRead()
        },
      ),
    )
    actions.set(
      "message.markUnread",
      new MessageAction(
        (message: GoogleAppsScript.Gmail.GmailMessage, args: any) => {
          message.markUnread()
        },
      ),
    )
    actions.set(
      "message.moveToTrash",
      new MessageAction(
        (message: GoogleAppsScript.Gmail.GmailMessage, args: any) => {
          message.moveToTrash()
        },
      ),
    )
    actions.set(
      "message.star",
      new MessageAction(
        (message: GoogleAppsScript.Gmail.GmailMessage, args: any) => {
          message.star()
        },
      ),
    )
    actions.set(
      "message.unstar",
      new MessageAction(
        (message: GoogleAppsScript.Gmail.GmailMessage, args: any) => {
          message.unstar()
        },
      ),
    )
    return actions
  }
}
