import { AttachmentRule } from "../config/AttachmentRule"

export class AttachmentContext {
  constructor(
    public attachmentRule: AttachmentRule,
    public attachment: GoogleAppsScript.Gmail.GmailAttachment,
    public index: number,
    public ruleIndex: number,
  ) {}
}
