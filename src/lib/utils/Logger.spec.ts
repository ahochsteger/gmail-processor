import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { ProcessingContext } from "../Context"
import { ConfigMocks } from "./../../test/mocks/ConfigMocks"
import { LogLevel, LogRedactionMode } from "./../config/SettingsConfig"
import { Logger } from "./Logger"

let logger: Logger
let mocks: Mocks
let spyLog: jest.SpyInstance
let spyError: jest.SpyInstance

beforeAll(() => {
  logger = new Logger()
  mocks = MockFactory.newMocks()
  spyLog = jest.spyOn(console, "log")
  spyError = jest.spyOn(console, "error")
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe("log levels", () => {
  it("should log a trace message", () => {
    logger.trace(mocks.processingContext, {
      location: "Logger.spec",
      message: "Log message",
    })
    expect(spyLog.mock.calls?.[0]?.[0]).toMatch(
      /^[^ ]+ TRACE \[Logger\.spec\] Log message$/,
    )
  })

  it("should log a debug message", () => {
    logger.debug("Log message")
    expect(spyLog.mock.calls[0][0]).toMatch(/^[^ ]+ DEBUG Log message$/)
  })

  it("should log an info message", () => {
    logger.info("Log message")
    expect(spyLog.mock.calls[0][0]).toMatch(/^[^ ]+ INFO Log message$/)
  })

  it("should log a warning message", () => {
    logger.warn("Log message")
    expect(spyLog.mock.calls[0][0]).toMatch(/^[^ ]+ WARN Log message$/)
  })

  it("should log an error message", () => {
    logger.error("Log message")
    expect(spyError.mock.calls[0][0]).toMatch(/^[^ ]+ ERROR Log message$/)
  })

  it("should filter log levels", () => {
    logger = new Logger(LogLevel.WARN)

    spyLog.mockClear()
    logger.debug("Log message")
    expect(spyLog).not.toHaveBeenCalled()
    expect(spyError).not.toHaveBeenCalled()

    spyLog.mockClear()
    logger.info("Log message")
    expect(spyLog).not.toHaveBeenCalled()
    expect(spyError).not.toHaveBeenCalled()

    spyError.mockClear()
    logger.warn("Log message")
    expect(spyLog).toHaveBeenCalled()
    expect(spyError).not.toHaveBeenCalled()

    spyError.mockClear()
    logger.error("Log message")
    expect(spyError).toHaveBeenCalled()
  })
})

describe("logsheet", () => {
  it("should trace to console and not logsheet", () => {
    const config = ConfigMocks.newDefaultConfig()
    config.settings.logSheetTracing = false
    mocks = MockFactory.newMocks(config)
    const ctx = mocks.processingContext
    const logSpy = jest.spyOn(console, "log")
    const sheetSpy = jest.spyOn(ctx.proc.spreadsheetAdapter, "log")
    logSpy.mockClear()
    sheetSpy.mockClear()
    logger.trace(ctx, {
      location: "Logger.logTrace()",
      message: "Trace message",
    })
    expect(logSpy.mock.calls[0][0]).toMatch(
      /^[^ ]+ TRACE \[Logger\.logTrace\(\)\] Trace message/,
    )
    expect(sheetSpy).not.toHaveBeenCalled()
  })

  it("should trace to console and logsheet", () => {
    const config = ConfigMocks.newDefaultConfig()
    config.settings.logSheetTracing = true
    mocks = MockFactory.newMocks(config)
    const ctx = mocks.processingContext
    const sheetSpy = jest.spyOn(ctx.proc.spreadsheetAdapter, "log")
    spyLog.mockClear()
    sheetSpy.mockClear()
    logger.trace(ctx, {
      location: "Logger.logTrace()",
      message: "Trace message",
    })
    expect(spyLog.mock.calls[0][0]).toMatch(
      /^[^ ]+ TRACE \[Logger\.logTrace\(\)\] Trace message/,
    )
    expect(sheetSpy).toHaveBeenCalled()
  })
})

describe("redact", () => {
  let ctx: ProcessingContext
  beforeEach(() => {
    ctx = mocks.processingContext
    ctx.proc.config.settings.logSensitiveRedactionMode = LogRedactionMode.AUTO
  })
  it("should show beginning and end of longer sensible information in AUTO mode", () => {
    const actual = logger.redact(
      mocks.processingContext,
      "abcdefghijklmnopqrstuvwxyz",
    )
    expect(actual).toEqual("abc...xyz")
  })
  it("should show '(redacted)' for longer sensible information in ALL mode", () => {
    ctx.proc.config.settings.logSensitiveRedactionMode = LogRedactionMode.ALL
    const actual = logger.redact(
      mocks.processingContext,
      "abcdefghijklmnopqrstuvwxyz",
    )
    expect(actual).toEqual("(redacted)")
  })
  it("should show '(redacted)' for shorter sensible information in AUTO mode", () => {
    const actual = logger.redact(mocks.processingContext, "abcdef")
    expect(actual).toEqual("(redacted)")
  })
  it("should show not redact anything in NONE mode", () => {
    ctx.proc.config.settings.logSensitiveRedactionMode = LogRedactionMode.NONE
    const actual = logger.redact(mocks.processingContext, "abcdef")
    expect(actual).toEqual("abcdef")
  })
  it("should gracefully handle null values", () => {
    const actual = logger.redact(mocks.processingContext, null)
    expect(actual).toEqual("")
  })
  it("should gracefully handle undefined values", () => {
    const actual = logger.redact(mocks.processingContext)
    expect(actual).toEqual("")
  })
})
