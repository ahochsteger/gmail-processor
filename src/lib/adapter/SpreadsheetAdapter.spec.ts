import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import { LOGSHEET_FILE_PATH } from "../../test/mocks/GDriveMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { Config } from "../config/Config"
import { SpreadsheetAdapter } from "./SpreadsheetAdapter"

let spreadsheetAdapter: SpreadsheetAdapter
let mocks: Mocks
let config: Config
beforeEach(() => {
  config = {
    ...ConfigMocks.newDefaultConfigJson(),
    settings: {
      ...ConfigMocks.newDefaultSettingsConfigJson(),
      logSheetLocation: LOGSHEET_FILE_PATH,
      richLogFields: ["log.timestamp", "field1", "field2", "log.message"],
      richLogConfig: [
        { key: "field1", title: "Field 1", value: "static value" },
        { key: "field2", title: "Field 2", value: "${context.type}" },
      ],
    },
  }
  mocks = MockFactory.newMocks(config)
  spreadsheetAdapter = mocks.processingContext.proc.spreadsheetAdapter
})

it("should initialize a new logsheet", () => {
  // NOTE: MockFactory.newMocks() calls constructor of SpreadsheetAdapter
  expect(mocks.spreadsheetApp.create).toHaveBeenCalled()
  expect(mocks.logSheet.appendRow).toHaveBeenCalled()
})

it("should log to an existing logsheet", () => {
  mocks.spreadsheetApp.create.mockReset()
  mocks.logSheet.appendRow.mockReset()
  spreadsheetAdapter.log(mocks.attachmentContext, "some log message")
  expect(mocks.spreadsheetApp.create).not.toHaveBeenCalled()
  expect(mocks.logSheet.appendRow).toHaveBeenCalled()
})
