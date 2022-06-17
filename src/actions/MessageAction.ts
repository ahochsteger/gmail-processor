import { Action } from "./Action"

export class MessageAction extends Action {
  public run(message: GoogleAppsScript.Gmail.GmailMessage, args: any): void {
    super.run(message, args)
  }
}
