import { deprecated } from "../utils/Decorators"

export class BaseAdapter {
  constructor(
    public logger: Console = console,
    public dryRun = false,
  ) {}

  @deprecated("Use callDryRunAware() or @dryRunAware instead.")
  checkDryRun(message: string): boolean {
    if (this.dryRun) {
      this.logger.info(`Skipped (dryRun): ${message}'`)
      return true
    }
    this.logger.info(message)
    return false
  }
}
