export class MaxRuntimeReachedError extends Error {}

export class Timer {
  private startTime: Date

  constructor(private maxRuntime: number) {
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
  public now() {
    return new Date()
  }
  public start() {
    this.startTime = new Date()
    return this.startTime
  }
  public stop() {
    return this.getSecondsUntil(new Date())
  }

  public checkMaxRuntimeReached(throwError = true) {
    const runTime = this.getRunTime()
    if (runTime >= this.maxRuntime) {
      const msg = `Processing terminated due to reaching runtime of ${runTime}s (max:${this.maxRuntime}s).`
      console.warn(msg)
      if (throwError) {
        throw new MaxRuntimeReachedError(msg)
      } else {
        return true
      }
    }
    return false
  }
}
