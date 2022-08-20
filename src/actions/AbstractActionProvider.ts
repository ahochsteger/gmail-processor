import { ProcessingContext } from "../context/ProcessingContext"

export abstract class AbstractActionProvider {
  constructor(
    protected context: ProcessingContext,
    protected logger: Console = console,
    protected dryRun = false
  ) {}

  checkDryRun(message: string): boolean {
    if (this.dryRun) {
      this.logger.info(`Skipped (dryrun): ${message}'`)
      return true
    }
    this.logger.info(message)
    return false
  }
}
