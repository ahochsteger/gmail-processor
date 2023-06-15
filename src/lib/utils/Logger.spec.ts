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
  logger.debug("Log message")
  expect(spy.mock.calls[0][0]).toMatch(/^\[[^\]]+\] DEBUG: Log message$/)
})

it("should log an info message", () => {
  spy = jest.spyOn(console, "log").mockImplementation()
  logger.info("Log message")
  expect(spy.mock.calls[0][0]).toMatch(/^\[[^\]]+\] INFO: Log message$/)
})

it("should log a warning message", () => {
  const spy = jest.spyOn(console, "log").mockImplementation()
  logger.warn("Log message")
  expect(spy.mock.calls[0][0]).toMatch(/^\[[^\]]+\] WARN: Log message$/)
})

it("should log an error message", () => {
  const spy = jest.spyOn(console, "log").mockImplementation()
  logger.error("Log message")
  expect(spy.mock.calls[0][0]).toMatch(/^\[[^\]]+\] ERROR: Log message$/)
})

it("should log an EnvContext", () => {
  const spy = jest.spyOn(console, "log").mockImplementation()
  const ctx = mocks.envContext
  logger.logEnvContext(ctx, LogLevel.WARN)
  expect(spy.mock.calls[0][0]).toMatch(/^\[[^\]]+\] WARN: EnvContext: .+/)
})

it("should log an ProcessingContext", () => {
  const spy = jest.spyOn(console, "log").mockImplementation()
  const ctx = mocks.processingContext
  logger.logProcessingContext(ctx, LogLevel.DEBUG)
  expect(spy.mock.calls[1][0]).toMatch(
    /^\[[^\]]+\] DEBUG: ProcessingContext: .+/,
  )
})

it("should log an ThreadContext", () => {
  const spy = jest.spyOn(console, "log").mockImplementation()
  const ctx = mocks.threadContext
  logger.logThreadContext(ctx, LogLevel.ERROR)
  expect(spy.mock.calls[2][0]).toMatch(/^\[[^\]]+\] ERROR: ThreadContext: .+/)
})

it("should log an MessageContext", () => {
  const spy = jest.spyOn(console, "log").mockImplementation()
  const ctx = mocks.messageContext
  logger.logMessageContext(ctx, LogLevel.INFO)
  expect(spy.mock.calls[3][0]).toMatch(/^\[[^\]]+\] INFO: MessageContext: .+/)
})

it("should log an AttachmentContext", () => {
  const spy = jest.spyOn(console, "log").mockImplementation()
  const ctx = mocks.attachmentContext
  logger.logAttachmentContext(ctx)
  expect(spy.mock.calls[4][0]).toMatch(
    /^\[[^\]]+\] INFO: AttachmentContext: .+/,
  )
})
