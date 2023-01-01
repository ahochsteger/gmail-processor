import { ProcessingContext } from "../context/ProcessingContext"

export abstract class AbstractActions {
  protected logger
  constructor(
    protected processingContext: ProcessingContext,
  ) {
    this.logger = processingContext.gasContext.logger
  }

  checkDryRun(message: string): boolean {
    if (this.processingContext.config.settings.dryRun) {
      this.logger.info(`Skipped (dryRun): ${message}'`)
      return true
    }
    this.logger.info(message)
    return false
  }
}
