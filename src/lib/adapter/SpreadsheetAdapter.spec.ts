import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import { LOGSHEET_FILE_NAME } from "../../test/mocks/GDriveMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { RunMode } from "../Context"
import { SpreadsheetAdapter } from "./SpreadsheetAdapter"

let spreadsheetAdapter: SpreadsheetAdapter
let mocks: Mocks
beforeEach(() => {
  mocks = MockFactory.newMocks(
    ConfigMocks.newDefaultConfig(),
    RunMode.DANGEROUS,
  )
  spreadsheetAdapter = new SpreadsheetAdapter(mocks.envContext)
})

it("should initialize a new logsheet", () => {
  spreadsheetAdapter.initLogSheet("some-folder-path", "")
  expect(mocks.spreadsheetApp.create).toBeCalled()
  expect(mocks.logSheetRange.setValues).toBeCalled()
})

it("should log attachment info to an existing logsheet", () => {
  spreadsheetAdapter.logAttachmentInfo(
    mocks.message,
    mocks.attachment,
    `/${LOGSHEET_FILE_NAME}`,
    "some log message",
  )
  expect(mocks.spreadsheetApp.create).not.toBeCalled()
  expect(mocks.logSheetRange.setValues).toBeCalled()
})

it("should log attachment info to an existing logsheet", () => {
  spreadsheetAdapter.logAttachmentStored(
    mocks.message,
    mocks.attachment,
    "some-location",
    mocks.existingFile,
  )
  expect(mocks.spreadsheetApp.create).not.toBeCalled()
  expect(mocks.logSheetRange.setValues).toBeCalled()
})

it("should log creation of a thread PDF to an existing logsheet", () => {
  spreadsheetAdapter.logThreadPdf(
    mocks.thread,
    "some-location",
    mocks.existingFile,
  )
  expect(mocks.spreadsheetApp.create).not.toBeCalled()
  expect(mocks.logSheetRange.setValues).toBeCalled()
})

it("should log creation of a message PDF to an existing logsheet", () => {
  spreadsheetAdapter.logMessagePdf(
    mocks.message,
    "some-location",
    mocks.existingFile,
  )
  expect(mocks.spreadsheetApp.create).not.toBeCalled()
  expect(mocks.logSheetRange.setValues).toBeCalled()
})
