import { ThreadConfig } from "../config/ThreadConfig"

export class ThreadContext {
  constructor(
    public threadConfig: ThreadConfig,
    public thread: GoogleAppsScript.Gmail.GmailThread,
    public index: number,
    public configIndex: number,
  ) {}
}
