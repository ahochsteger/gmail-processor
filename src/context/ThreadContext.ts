import { ThreadActions } from "../actions/ThreadActions"
import { ThreadConfig } from "../config/ThreadConfig"
import { ProcessingContext } from "./ProcessingContext"

export class ThreadContext extends ProcessingContext {
  public threadActions = new ThreadActions()
  constructor(
    public processingContext: ProcessingContext,
    public threadConfig: ThreadConfig,
    public thread: GoogleAppsScript.Gmail.GmailThread,
    public threadConfigIndex = 0,
    public threadIndex = 0,
  ) {
    super(
      processingContext.gasContext,
      processingContext.config,
      processingContext.dryRun,
    )
  }
}
