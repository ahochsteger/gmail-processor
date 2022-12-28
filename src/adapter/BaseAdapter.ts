export class BaseAdapter {

  constructor(
    public logger: Console = console,
    public dryRun = false,
  ) {}

  checkDryRun(message: string): boolean {
    if (this.dryRun) {
      this.logger.info(`Skipped (dryRun): ${message}'`)
      return true
    }
    this.logger.info(message)
    return false
  }
}
