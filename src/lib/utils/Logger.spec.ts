import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { LogLevel, Logger } from "./Logger"

let logger: Logger
let mocks: Mocks
let spy: jest.SpyInstance

beforeEach(() => {
  logger = new Logger()
  mocks = MockFactory.newMocks()
})
afterEach(() => {
  spy.mockReset()
})

it("should log a debug message", () => {
  spy = jest.spyOn(console, "log").mockImplementation()
  spy.mockClear()
  logger.debug("Log message")
  expect(spy.mock.calls[0][0]).toMatch(/^\[[^\]]+\] DEBUG: Log message$/)
})

it("should log an info message", () => {
  spy = jest.spyOn(console, "log").mockImplementation()
  spy.mockClear()
  logger.info("Log message")
  expect(spy.mock.calls[0][0]).toMatch(/^\[[^\]]+\] INFO: Log message$/)
})

it("should log a warning message", () => {
  const spy = jest.spyOn(console, "error").mockImplementation()
  spy.mockClear()
  logger.warn("Log message")
  expect(spy.mock.calls[0][0]).toMatch(/^\[[^\]]+\] WARN: Log message$/)
})

it("should log an error message", () => {
  const spy = jest.spyOn(console, "error").mockImplementation()
  spy.mockClear()
  logger.error("Log message")
  expect(spy.mock.calls[0][0]).toMatch(/^\[[^\]]+\] ERROR: Log message$/)
})

it("should log an EnvContext", () => {
  const spy = jest.spyOn(console, "log").mockImplementation()
  const ctx = mocks.envContext
  spy.mockClear()
  logger.logEnvContext(ctx, LogLevel.WARN)
  expect(spy.mock.calls[0][0]).toMatch(/^\[[^\]]+\] DEBUG: EnvContext: .+/)
})

it("should log an ProcessingContext", () => {
  const spy = jest.spyOn(console, "log").mockImplementation()
  const ctx = mocks.processingContext
  spy.mockClear()
  logger.logProcessingContext(ctx, LogLevel.DEBUG)
  expect(spy.mock.calls[0][0]).toMatch(
    /^\[[^\]]+\] DEBUG: ProcessingContext: .+/,
  )
})

it("should log an ThreadContext", () => {
  const spy = jest.spyOn(console, "log").mockImplementation()
  const ctx = mocks.threadContext
  spy.mockClear()
  logger.logThreadContext(ctx, LogLevel.ERROR)
  expect(spy.mock.calls[0][0]).toMatch(/^\[[^\]]+\] DEBUG: ThreadContext: .+/)
})

it("should log an MessageContext", () => {
  const spy = jest.spyOn(console, "log").mockImplementation()
  const ctx = mocks.messageContext
  spy.mockClear()
  logger.logMessageContext(ctx, LogLevel.INFO)
  expect(spy.mock.calls[0][0]).toMatch(/^\[[^\]]+\] DEBUG: MessageContext: .+/)
})

it("should log an AttachmentContext", () => {
  const spy = jest.spyOn(console, "log").mockImplementation()
  const ctx = mocks.attachmentContext
  spy.mockClear()
  logger.logAttachmentContext(ctx)
  expect(spy.mock.calls[0][0]).toMatch(
    /^\[[^\]]+\] DEBUG: AttachmentContext: .+/,
  )
})
