import { Config } from "../config/Config"
import { plainToClass } from "class-transformer"
import { ActionRegistry } from "./ActionRegistry"
import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"

let mocks: Mocks
let dryRunMocks: Mocks
let actionRegistry: ActionRegistry

beforeEach(() => {
  mocks = MockFactory.newMocks(new Config(), false)
  actionRegistry = new ActionRegistry()
  actionRegistry.registerActionProvider("thread", mocks.threadActions)
  dryRunMocks = MockFactory.newMocks(new Config(), true)
})

it("should provide actions in the action registry", () => {
  expect(mocks.threadActions).not.toBeNull()

  const actionNames = Array.from(actionRegistry.getActions().keys())
    .filter((v) => v.startsWith("thread."))
    .sort()
  expect(actionNames).toEqual([
    "thread.addLabel",
    "thread.markImportant",
    "thread.markProcessed",
    "thread.markRead",
    "thread.markUnimportant",
    "thread.markUnread",
    "thread.moveToArchive",
    "thread.moveToInbox",
    "thread.moveToSpam",
    "thread.moveToTrash",
    "thread.removeLabel",
    "thread.storeAsPdfToGDrive",
  ])
})

it("should mark a thread as important", () => {
  mocks.threadActions.markImportant(mocks.threadContext)
  expect(mocks.thread.markImportant).toBeCalled()
})

it("should not mark a thread as important (dryRun)", () => {
  dryRunMocks.threadActions.markImportant(dryRunMocks.threadContext)
  expect(dryRunMocks.thread.markImportant).not.toBeCalled()
})

it("should mark a thread as processed by adding a label if processedMode='label'", () => {
  const config = plainToClass(Config, {
    settings: {
      processedLabel: "some-label",
      processedMode: "label",
    },
  })
  const mocks = MockFactory.newMocks(config, false)
  mocks.threadActions.markProcessed(mocks.threadContext)
  expect(mocks.thread.addLabel).toBeCalled()
})

it("should not add a label to a thread if processedMode='read'", () => {
  const config = plainToClass(Config, {
    settings: {
      processedMode: "read",
    },
  })
  const mocks = MockFactory.newMocks(config, false)
  mocks.threadActions.markProcessed(mocks.threadContext)
  expect(mocks.thread.addLabel).not.toBeCalled()
})

it("should store a thread as PDF with header", () => {
  mocks.threadActions.storeAsPdfToGDrive(mocks.threadContext, {
    location: "thread.pdf",
    conflictStrategy: ConflictStrategy.REPLACE,
    skipHeader: false,
  })
  expect(mocks.blob.getAs).toBeCalledWith("application/pdf")
  expect(mocks.blob.getDataAsString()).toEqual("PDF-Contents")
  expect(mocks.thread.getFirstMessageSubject).toBeCalled()
})

it("should store a thread as PDF without header", () => {
  mocks.threadActions.storeAsPdfToGDrive(mocks.threadContext, {
    location: "thread.pdf",
    conflictStrategy: ConflictStrategy.REPLACE,
    skipHeader: true,
  })
  expect(mocks.blob.getAs).toBeCalledWith("application/pdf")
  expect(mocks.blob.getDataAsString()).toEqual("PDF-Contents")
  expect(mocks.thread.getMessages()[0].getSubject).not.toBeCalled()
})

it.todo("should use filenameTo as the output filename") // See PR #61
