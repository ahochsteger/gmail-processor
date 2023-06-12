import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import { ContextMocks } from "../../test/mocks/ContextMocks"
import { ProcessingContext } from "../Context"
import { DEFAULT_SETTING_MAX_RUNTIME } from "../config/SettingsConfig"

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
