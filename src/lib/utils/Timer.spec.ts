import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import { ContextMocks } from "../../test/mocks/ContextMocks"
import { ProcessingContext } from "../Context"
import { DEFAULT_SETTING_MAX_RUNTIME } from "../config/SettingsConfig"
import { Timer } from "./Timer"

function getProcessingContextWithRuntime(
  maxRuntime: number,
): ProcessingContext {
  const config = ConfigMocks.newDefaultConfig()
  config.settings.maxRuntime = maxRuntime
  const ctx = ContextMocks.newProcessingContextMock(
    ContextMocks.newEnvContextMock(),
    config,
  )
  return ctx
}

describe("checkMaxRuntimeReached()", () => {
  it("should do nothing if maxRuntime is not reached", () => {
    const ctx = getProcessingContextWithRuntime(DEFAULT_SETTING_MAX_RUNTIME)
    expect(ctx.proc.timer.checkMaxRuntimeReached()).toBeFalsy()
  })
  it("should throw an error if maxRuntime reached", () => {
    const ctx = getProcessingContextWithRuntime(0)
    expect(() => {
      ctx.proc.timer.checkMaxRuntimeReached()
    }).toThrow()
  })
  it("should return true if maxRuntime reached", () => {
    const ctx = getProcessingContextWithRuntime(0)
    expect(ctx.proc.timer.checkMaxRuntimeReached(false)).toBeTruthy()
  })
})

describe("Timer lifecycle and getters", () => {
  it("should provide start time and run time", () => {
    const timer = new Timer(10)
    expect(timer.getStartTime()).toBeInstanceOf(Date)
    expect(timer.getRunTime()).toBeGreaterThanOrEqual(0)
  })

  it("should provide seconds until a given time", () => {
    const timer = new Timer(10)
    const future = new Date(timer.getStartTime().getTime() + 5000)
    expect(timer.getSecondsUntil(future)).toBe(5)
  })

  it("should support restarting the timer", () => {
    const timer = new Timer(10)
    const initialStart = timer.getStartTime()
    jest.advanceTimersByTime(1000)
    const newStart = timer.start()
    expect(newStart.getTime()).toBeGreaterThan(initialStart.getTime())
    expect(timer.getStartTime()).toBe(newStart)
  })

  it("should provide current time via now()", () => {
    const timer = new Timer(10)
    expect(timer.now()).toBeInstanceOf(Date)
  })

  it("should support stopping and returning runtime", () => {
    const timer = new Timer(10)
    jest.advanceTimersByTime(2000)
    const runtime = timer.stop()
    expect(runtime).toBe(2)
  })
})
