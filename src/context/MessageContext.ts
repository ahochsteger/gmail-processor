import { MessageConfig } from "../config/MessageConfig"

export class MessageContext {
  constructor(
    public messageConfig: MessageConfig,
    public message: GoogleAppsScript.Gmail.GmailMessage,
    public index: number,
    public ruleIndex: number,
  ) {}
}
