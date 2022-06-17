export class Timer {
  private startTime: Date

  constructor() {
    this.startTime = new Date()
  }

  public getStartTime() {
    return this.startTime
  }
  public getSecondsUntil(time: Date) {
    return (time.getTime() - this.startTime.getTime()) / 1000
  }
  public getRunTime() {
    return this.getSecondsUntil(new Date())
  }
  public start() {
    this.startTime = new Date()
    return this.startTime
  }
  public stop() {
    return this.getSecondsUntil(new Date())
  }
}
