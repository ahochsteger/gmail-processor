import { MockFactory } from "../test/mocks/MockFactory"
import { ContextType, RunMode } from "./Context"
import { EnvProvider } from "./EnvProvider"

describe("EnvProvider", () => {
  it("should build meta info correctly", () => {
    const mocks = MockFactory.newMocks()
    const ctx = mocks.envContext
    const meta = EnvProvider.buildMetaInfo(ctx)

    expect(meta["date.now"]).toBeDefined()
    expect((meta["env.runMode"]?.value as () => string)()).toBe(ctx.env.runMode)
    expect((meta["env.timezone"]?.value as () => string)()).toBe(
      ctx.env.timezone,
    )
    expect((meta["user.email"]?.value as () => string)()).toBe(
      ctx.env.session.getActiveUser().getEmail(),
    )
  })

  it("should create a default context with overrides", () => {
    // We mock global GAS services that are used in defaultContext
    const mockGlobals = [
      "CacheService",
      "DriveApp",
      "DocumentApp",
      "Drive",
      "GmailApp",
      "MailApp",
      "SpreadsheetApp",
      "Utilities",
      "Session",
      "UrlFetchApp",
      "PropertiesService",
    ]
    mockGlobals.forEach((g) => {
      ;(global as any)[g] = {}
    })
    ;(global as any).Session.getScriptTimeZone = jest
      .fn()
      .mockReturnValue("UTC")
    ;(global as any).Session.getActiveUser = jest
      .fn()
      .mockReturnValue({ getEmail: () => "test@example.com" })

    const ctx = EnvProvider.defaultContext({ runMode: RunMode.DANGEROUS })

    expect(ctx.type).toBe(ContextType.ENV)
    expect(ctx.env.runMode).toBe(RunMode.DANGEROUS)
    expect(ctx.env.timezone).toBe("UTC")

    // Cleanup globals
    mockGlobals.forEach((g) => {
      delete (global as any)[g]
    })
  })
})
