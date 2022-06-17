import { ThreadRule } from "../config/ThreadRule"

export class ThreadContext {
  constructor(
    public threadRule: ThreadRule,
    public thread: GoogleAppsScript.Gmail.GmailThread,
    public index: number,
    public ruleIndex: number,
  ) {}
}
