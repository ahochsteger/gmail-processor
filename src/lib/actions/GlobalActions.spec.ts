import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { LogLevel } from "../utils/Logger"
import { GlobalActions } from "./GlobalActions"

let mocks: Mocks
let spy: jest.SpyInstance

beforeAll(() => {
  mocks = MockFactory.newMocks()
})
afterEach(() => {
  spy.mockReset()
})

it("should log with default level to console", () => {
  spy = jest.spyOn(console, "log").mockImplementation()
  GlobalActions.log(mocks.processingContext, { message: "Log message" })
  expect(spy.mock.calls[0][0]).toMatch(/^\[[^\]]+\] INFO: Log message/)
})

it("should log to console with a certain log level to console", () => {
  spy = jest.spyOn(console, "error").mockImplementation()
  GlobalActions.log(mocks.processingContext, {
    level: LogLevel.WARN,
    message: "Log message",
  })
  expect(spy.mock.calls[0][0]).toMatch(/^\[[^\]]+\] WARN: Log message/)
})

it("should log with default level to a logSheet", () => {
  GlobalActions.sheetLog(mocks.processingContext, { message: "Log message" })
  // TODO: Test should not depend on the action implementation
  expect(mocks.logSheet.appendRow.mock.calls[0][0][7]).toEqual("Log message")
})

it("should log to console with a certain log level to a logSheet", () => {
  GlobalActions.sheetLog(mocks.processingContext, {
    level: LogLevel.WARN,
    message: "Log message",
  })
  // TODO: Test should not depend on the action implementation
  expect(mocks.logSheet.appendRow.mock.calls[0][0][7]).toEqual("Log message")
})
