import { Action } from "./Action"

export class ThreadAction extends Action {
  public run(thread: GoogleAppsScript.Gmail.GmailThread, args: any): void {
    super.run(thread, args)
  }
}
