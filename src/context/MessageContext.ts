import { MessageRule } from "../config/MessageRule"

export class MessageContext {
  constructor(
    public messageRule: MessageRule,
    public message: GoogleAppsScript.Gmail.GmailMessage,
    public index: number,
    public ruleIndex: number,
  ) {}
}
