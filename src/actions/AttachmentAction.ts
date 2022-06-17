import { Action } from "./Action"

export class AttachmentAction extends Action {
  public run(
    attachment: GoogleAppsScript.Gmail.GmailAttachment,
    args: any,
  ): void {
    super.run(attachment, args)
  }
}
