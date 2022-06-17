import { ActionProvider } from "./ActionProvider"
import { Actions } from "./Actions"
import { ThreadAction } from "./ThreadAction"

export class GmailThreadActions implements ActionProvider {
  /**
   * Actions exposed to Gmail2GDrive
   */
  public getActions(): Actions {
    const actions: Actions = new Actions()
    actions.set(
      "thread.markImportant",
      new ThreadAction(
        (thread: GoogleAppsScript.Gmail.GmailThread, args: any) => {
          thread.markImportant()
        },
      ),
    )
    actions.set(
      "thread.markRead",
      new ThreadAction(
        (thread: GoogleAppsScript.Gmail.GmailThread, args: any) => {
          thread.markRead()
        },
      ),
    )
    actions.set(
      "thread.markUnimportant",
      new ThreadAction(
        (thread: GoogleAppsScript.Gmail.GmailThread, args: any) => {
          thread.markUnimportant()
        },
      ),
    )
    actions.set(
      "thread.markUnread",
      new ThreadAction(
        (thread: GoogleAppsScript.Gmail.GmailThread, args: any) => {
          thread.markUnread()
        },
      ),
    )
    actions.set(
      "thread.moveToArchive",
      new ThreadAction(
        (thread: GoogleAppsScript.Gmail.GmailThread, args: any) => {
          thread.moveToArchive()
        },
      ),
    )
    actions.set(
      "thread.moveToInbox",
      new ThreadAction(
        (thread: GoogleAppsScript.Gmail.GmailThread, args: any) => {
          thread.moveToInbox()
        },
      ),
    )
    actions.set(
      "thread.moveToSpam",
      new ThreadAction(
        (thread: GoogleAppsScript.Gmail.GmailThread, args: any) => {
          thread.moveToSpam()
        },
      ),
    )
    actions.set(
      "thread.moveToTrash",
      new ThreadAction(
        (thread: GoogleAppsScript.Gmail.GmailThread, args: any) => {
          thread.moveToTrash()
        },
      ),
    )
    actions.set(
      "thread.addLabel",
      new ThreadAction(
        (thread: GoogleAppsScript.Gmail.GmailThread, args: any) => {
          thread.addLabel(args.label)
        },
      ),
    )
    actions.set(
      "thread.removeLabel",
      new ThreadAction(
        (thread: GoogleAppsScript.Gmail.GmailThread, args: any) => {
          thread.removeLabel(args.label)
        },
      ),
    )
    return actions
  }
}
