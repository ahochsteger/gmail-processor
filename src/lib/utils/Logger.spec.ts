import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { Logger } from "./Logger"

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
  spy = jest.spyOn(console, "debug").mockImplementation()
  logger.debug("Log message")
  expect(spy).toHaveBeenCalledWith("DEBUG: Log message")
})

it("should log an info message", () => {
  spy = jest.spyOn(console, "info").mockImplementation()
  logger.info("Log message")
  expect(spy).toHaveBeenCalledWith("INFO: Log message")
})

it("should log a warning message", () => {
  const spy = jest.spyOn(console, "warn").mockImplementation()
  logger.warn("Log message")
  expect(spy).toHaveBeenCalledWith("WARNING: Log message")
})

it("should log an error message", () => {
  const spy = jest.spyOn(console, "error").mockImplementation()
  logger.error("Log message")
  expect(spy).toHaveBeenCalledWith("ERROR: Log message")
})

it("should log an EnvContext", () => {
  const spy = jest.spyOn(console, "info").mockImplementation()
  const ctx = mocks.envContext
  logger.logEnvContext(ctx)
  expect(spy).toHaveBeenCalledWith(
    `INFO: EnvContext: ${JSON.stringify(ctx.env, null, 2)}`,
  )
})

it("should log an ProcessingContext", () => {
  const spy = jest.spyOn(console, "info").mockImplementation()
  const ctx = mocks.processingContext
  logger.logProcessingContext(ctx)
  expect(spy).toHaveBeenCalledWith(
    `INFO: ProcessingContext: ${JSON.stringify(
      { config: ctx.proc.config },
      null,
      2,
    )}`,
  )
})

it("should log an ThreadContext", () => {
  const spy = jest.spyOn(console, "info").mockImplementation()
  const ctx = mocks.threadContext
  logger.logThreadContext(ctx)
  expect(spy).toHaveBeenCalledWith(
    `INFO: ThreadContext: ${JSON.stringify(
      {
        config: ctx.thread.config,
        object: {
          id: ctx.thread.object.getId(),
          firstMessageSubject: ctx.thread.object.getFirstMessageSubject(),
        },
      },
      null,
      2,
    )}`,
  )
})

it("should log an MessageContext", () => {
  const spy = jest.spyOn(console, "info").mockImplementation()
  const ctx = mocks.messageContext
  logger.logMessageContext(ctx)
  expect(spy).toHaveBeenCalledWith(
    `INFO: MessageContext: ${JSON.stringify(
      {
        config: ctx.message.config,
        object: {
          from: ctx.message.object.getFrom(),
          id: ctx.message.object.getId(),
          subject: ctx.message.object.getSubject(),
          to: ctx.message.object.getTo(),
        },
      },
      null,
      2,
    )}`,
  )
})

it("should log an AttachmentContext", () => {
  const spy = jest.spyOn(console, "info").mockImplementation()
  const ctx = mocks.attachmentContext
  logger.logAttachmentContext(ctx)
  expect(spy).toHaveBeenCalledWith(
    `INFO: AttachmentContext: ${JSON.stringify(
      {
        config: ctx.attachment.config,
        object: {
          contentType: ctx.attachment.object.getContentType(),
          name: ctx.attachment.object.getName(),
          size: ctx.attachment.object.getSize(),
        },
      },
      null,
      2,
    )}`,
  )
})
