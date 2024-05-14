import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { ConfigMocks } from "./../../test/mocks/ConfigMocks"
import { LogLevel, Logger } from "./Logger"

let logger: Logger
let mocks: Mocks
let spy: jest.SpyInstance

beforeEach(() => {
  logger = new Logger()
  mocks = MockFactory.newMocks()
})
afterEach(() => {
  spy?.mockReset()
})

it("should log a trace message", () => {
  spy = jest.spyOn(console, "log").mockImplementation()
  spy.mockClear()
  logger.trace(mocks.processingContext, {
    location: "Logger.spec",
    message: "Log message",
  })
  expect(spy.mock.calls?.[0]?.[0]).toMatch(
    /^[^ ]+ TRACE \[Logger\.spec\] Log message$/,
  )
})

it("should log a debug message", () => {
  spy = jest.spyOn(console, "log").mockImplementation()
  spy.mockClear()
  logger.debug("Log message")
  expect(spy.mock.calls[0][0]).toMatch(/^[^ ]+ DEBUG Log message$/)
})

it("should log an info message", () => {
  spy = jest.spyOn(console, "log").mockImplementation()
  spy.mockClear()
  logger.info("Log message")
  expect(spy.mock.calls[0][0]).toMatch(/^[^ ]+ INFO Log message$/)
})

it("should log a warning message", () => {
  const spy = jest.spyOn(console, "error").mockImplementation()
  spy.mockClear()
  logger.warn("Log message")
  expect(spy.mock.calls[0][0]).toMatch(/^[^ ]+ WARN Log message$/)
})

it("should log an error message", () => {
  const spy = jest.spyOn(console, "error").mockImplementation()
  spy.mockClear()
  logger.error("Log message")
  expect(spy.mock.calls[0][0]).toMatch(/^[^ ]+ ERROR Log message$/)
})

it("should filter log levels", () => {
  logger = new Logger(LogLevel.WARN)
  const spyLog = jest.spyOn(console, "log")
  const spyError = jest.spyOn(console, "error")
  spyLog.mockClear()
  logger.debug("Log message")
  expect(spyLog).not.toHaveBeenCalled()
  spyLog.mockClear()
  logger.info("Log message")
  expect(spyLog).not.toHaveBeenCalled()
  spyError.mockClear()
  logger.warn("Log message")
  expect(spyError).toHaveBeenCalled()
  spyError.mockClear()
  logger.error("Log message")
  expect(spyError).toHaveBeenCalled()
})

it("should trace to console and not logsheet", () => {
  const config = ConfigMocks.newDefaultConfig()
  config.settings.logSheetTracing = false
  mocks = MockFactory.newMocks(config)
  const ctx = mocks.processingContext
  const logSpy = jest.spyOn(console, "log")
  const sheetSpy = jest.spyOn(ctx.proc.spreadsheetAdapter, "log")
  logSpy.mockClear()
  sheetSpy.mockClear()
  logger.trace(ctx, { location: "Logger.logTrace()", message: "Trace message" })
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
  const logSpy = jest.spyOn(console, "log")
  const sheetSpy = jest.spyOn(ctx.proc.spreadsheetAdapter, "log")
  logSpy.mockClear()
  sheetSpy.mockClear()
  logger.trace(ctx, { location: "Logger.logTrace()", message: "Trace message" })
  expect(logSpy.mock.calls[0][0]).toMatch(
    /^[^ ]+ TRACE \[Logger\.logTrace\(\)\] Trace message/,
  )
  expect(sheetSpy).toHaveBeenCalled()
})

describe("redact", () => {
  it("should show beginning and end of longer sensible information", () => {
    const actual = logger.redact(
      mocks.processingContext,
      "abcdefghijklmnopqrstuvwxyz",
    )
    expect(actual).toEqual("abc...xyz")
  })
  it("should show (redacted) for shorter sensible information", () => {
    const actual = logger.redact(mocks.processingContext, "abcdef")
    expect(actual).toEqual("(redacted)")
  })
  it("should gracefully handle null and undefined values", () => {
    const actual = logger.redact(mocks.processingContext, null)
    expect(actual).toEqual("")
  })
})
