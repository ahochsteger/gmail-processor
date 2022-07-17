import { AttachmentConfig } from "../config/AttachmentConfig"

export class AttachmentContext {
  constructor(
    public attachmentConfig: AttachmentConfig,
    public attachment: GoogleAppsScript.Gmail.GmailAttachment,
    public index: number,
    public ruleIndex: number,
  ) {}
}
