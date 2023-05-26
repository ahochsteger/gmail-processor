import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { EnvContext, RunMode } from "../Context"
import { SpreadsheetAdapter } from "./SpreadsheetAdapter"

let spreadsheetAdapter: SpreadsheetAdapter
let ctx: EnvContext
let mocks: Mocks
beforeEach(() => {
  mocks = MockFactory.newMocks()
  ctx = MockFactory.newEnvContextMock(RunMode.DANGEROUS, mocks)
  ctx.env.spreadsheetApp
  spreadsheetAdapter = new SpreadsheetAdapter(ctx)
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
    "some-location",
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
    mocks.file,
  )
  expect(mocks.spreadsheetApp.create).not.toBeCalled()
  expect(mocks.logSheetRange.setValues).toBeCalled()
})

it("should log creation of a thread PDF to an existing logsheet", () => {
  spreadsheetAdapter.logThreadPdf(mocks.thread, "some-location", mocks.file)
  expect(mocks.spreadsheetApp.create).not.toBeCalled()
  expect(mocks.logSheetRange.setValues).toBeCalled()
})

it("should log creation of a message PDF to an existing logsheet", () => {
  spreadsheetAdapter.logMessagePdf(mocks.message, "some-location", mocks.file)
  expect(mocks.spreadsheetApp.create).not.toBeCalled()
  expect(mocks.logSheetRange.setValues).toBeCalled()
})
