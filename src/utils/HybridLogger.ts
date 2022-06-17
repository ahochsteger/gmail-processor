export class HybridLogger implements GoogleAppsScript.Base.Logger {
  constructor(public logger: GoogleAppsScript.Base.Logger | null = null) {}

  public clear(): void {
    if (this.logger) {
      this.logger.clear()
    }
  }
  public getLog(): string {
    return this.logger ? this.logger.getLog() : ""
  }
  public log(data: any): GoogleAppsScript.Base.Logger
  public log(format: string, ...values: any[]): GoogleAppsScript.Base.Logger
  public log(data: any, ...rest: any[]) {
    if (this.logger) {
      return this.logger.log(data, rest)
    } else {
      // tslint:disable-next-line: no-console
      console.log(data, rest)
      return this.logger
    }
  }
}
