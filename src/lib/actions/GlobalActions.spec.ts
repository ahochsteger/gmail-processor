import { LOGSHEET_FILE_PATH } from "../../test/mocks/GDriveMocks"
import {
  MockFactory,
  Mocks,
  fakedSystemDateTimeString,
} from "../../test/mocks/MockFactory"
import { Config } from "../config/Config"
import { LOG_LEVEL_NAME, LOG_MESSAGE_NAME } from "../config/SettingsConfig"
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

it("should log with default level (info) to a logSheet", () => {
  GlobalActions.sheetLog(mocks.attachmentContext, { message: "Log message" })
  // TODO: Test should not depend on the action implementation
  expect(mocks.logSheet.appendRow.mock.calls[0][0]).toEqual([
    `${fakedSystemDateTimeString}.000`,
    LogLevel.INFO,
    "Log message",
    "2019-05-02 07:15:28",
    "Message Subject 1",
    "message-from@example.com",
    "https://mail.google.com/mail/u/0/#inbox/message-id",
    "",
    "",
    "",
    "",
    "",
    "",
  ])
})

it("should log with a certain log level (warn) to a logSheet", () => {
  const message = "Test log message"
  const level = LogLevel.WARN
  GlobalActions.sheetLog(mocks.attachmentContext, {
    level,
    message,
  })
  // TODO: Test should not depend on the action implementation
  const levelIndex = mocks.attachmentContext.proc.logAdapter
    .getLogFieldNames()
    .indexOf(LOG_LEVEL_NAME)
  const messageIndex = mocks.attachmentContext.proc.logAdapter
    .getLogFieldNames()
    .indexOf(LOG_MESSAGE_NAME)
  expect(mocks.logSheet.appendRow.mock.calls[0][0][levelIndex]).toEqual(level)
  expect(mocks.logSheet.appendRow.mock.calls[0][0][messageIndex]).toEqual(
    message,
  )
})
