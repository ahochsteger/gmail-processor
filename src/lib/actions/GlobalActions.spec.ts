import { LOGSHEET_FILE_PATH } from "../../test/mocks/GDriveMocks"
import {
  MockFactory,
  Mocks,
  fakedSystemDateTimeString,
} from "../../test/mocks/MockFactory"
import { LOG_MESSAGE_NAME } from "../adapter/LogAdapter"
import { Config } from "../config/Config"
import { LogLevel } from "../utils/Logger"
import { ConfigMocks } from "./../../test/mocks/ConfigMocks"
import { GlobalActions } from "./GlobalActions"

let config: Config
let mocks: Mocks
let spy: jest.SpyInstance

beforeAll(() => {
  config = {
    ...ConfigMocks.newDefaultConfigJson(),
    settings: {
      ...ConfigMocks.newDefaultSettingsConfigJson(),
      logSheetLocation: LOGSHEET_FILE_PATH,
      logFields: ["log.timestamp", "field.1", "field.2", "log.message"],
      logConfig: [
        { name: "field.1", title: "Field 1", value: "static value" },
        { name: "field.2", title: "Field 2", value: "${context.type}" },
      ],
    },
  }
  mocks = MockFactory.newMocks(config)
})
afterEach(() => {
  if (spy) {
    spy.mockReset()
  }
})

it("should log with default level to console", () => {
  spy = jest.spyOn(console, "log").mockImplementation()
  GlobalActions.log(mocks.processingContext, { message: "Log message" })
  expect(spy.mock.calls[0][0]).toMatch(/^\[[^\]]+\] INFO: Log message/)
})

it("should with a certain log level to console", () => {
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
  expect(mocks.logSheet.appendRow.mock.calls[0][0]).toEqual([
    `${fakedSystemDateTimeString}.000`,
    "static value",
    "proc",
    "Log message",
  ])
})

it("should log with a certain log level to a logSheet", () => {
  GlobalActions.sheetLog(mocks.processingContext, {
    level: LogLevel.WARN,
    message: "Log message",
  })
  // TODO: Test should not depend on the action implementation
  const i = mocks.processingContext.proc.logAdapter
    .getLogFieldNames()
    .indexOf(LOG_MESSAGE_NAME)
  expect(mocks.logSheet.appendRow.mock.calls[0][0][i]).toEqual("Log message")
})
