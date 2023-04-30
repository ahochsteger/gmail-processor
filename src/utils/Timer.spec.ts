import { MockFactory } from "../../test/mocks/MockFactory"
import { ProcessingContext } from "../Context"
import { DEFAULT_SETTING_MAX_RUNTIME } from "../config/SettingsConfig"

function getProcessingContextWithRuntime(
  maxRuntime: number,
): ProcessingContext {
  const config = MockFactory.newDefaultConfig()
  config.settings.maxRuntime = maxRuntime
  const ctx = MockFactory.newProcessingContextMock(
    MockFactory.newEnvContextMock(),
    config,
  )
  return ctx
}

describe("checkTimeout()", () => {
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
