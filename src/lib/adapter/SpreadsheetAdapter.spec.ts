import { PartialDeep } from "type-fest"
import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import { LOGSHEET_FILE_PATH } from "../../test/mocks/GDriveMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { Config } from "../config/Config"
import { SpreadsheetAdapter } from "./SpreadsheetAdapter"

let spreadsheetAdapter: SpreadsheetAdapter
let mocks: Mocks
let config: PartialDeep<Config>
beforeEach(() => {
  config = {
    ...ConfigMocks.newDefaultConfigJson(),
    settings: {
      ...ConfigMocks.newDefaultSettingsConfigJson(),
      logSheetLocation: LOGSHEET_FILE_PATH,
    },
  }
  mocks = MockFactory.newMocks(config)
  spreadsheetAdapter = mocks.processingContext.proc.spreadsheetAdapter
})

it("should initialize a new logsheet", () => {
  // NOTE: MockFactory.newMocks() calls constructor of SpreadsheetAdapter
  expect(mocks.spreadsheetApp.create).toBeCalled()
  expect(mocks.logSheet.appendRow).toBeCalled()
})

it("should log attachment info to an existing logsheet", () => {
  mocks.spreadsheetApp.create.mockReset()
  mocks.logSheet.appendRow.mockReset()
  spreadsheetAdapter.logAttachmentInfo(
    mocks.attachmentContext,
    LOGSHEET_FILE_PATH,
    "some log message",
  )
  expect(mocks.spreadsheetApp.create).not.toBeCalled()
  expect(mocks.logSheet.appendRow).toBeCalled()
})

it("should log attachment info to an existing logsheet", () => {
  mocks.spreadsheetApp.create.mockReset()
  mocks.logSheet.appendRow.mockReset()
  spreadsheetAdapter.logAttachmentStored(
    mocks.attachmentContext,
    "some-location",
    mocks.existingFile,
  )
  expect(mocks.spreadsheetApp.create).not.toBeCalled()
  expect(mocks.logSheet.appendRow).toBeCalled()
})

it("should log creation of a thread PDF to an existing logsheet", () => {
  mocks.spreadsheetApp.create.mockReset()
  mocks.logSheet.appendRow.mockReset()
  spreadsheetAdapter.logThreadPdf(
    mocks.threadContext,
    "some-location",
    mocks.existingFile,
  )
  expect(mocks.spreadsheetApp.create).not.toBeCalled()
  expect(mocks.logSheet.appendRow).toBeCalled()
})

it("should log creation of a message PDF to an existing logsheet", () => {
  mocks.spreadsheetApp.create.mockReset()
  mocks.logSheet.appendRow.mockReset()
  spreadsheetAdapter.logMessagePdf(
    mocks.messageContext,
    "some-location",
    mocks.existingFile,
  )
  expect(mocks.spreadsheetApp.create).not.toBeCalled()
  expect(mocks.logSheet.appendRow).toBeCalled()
})
