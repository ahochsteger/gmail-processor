import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { ProcessingContext, RunMode } from "../Context"
import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { newConfig } from "../config/Config"
import { ActionProvider, ActionRegistry } from "./ActionRegistry"
import { ThreadActions } from "./ThreadActions"

let mocks: Mocks
let dryRunMocks: Mocks
let actionRegistry: ActionRegistry

beforeEach(() => {
  mocks = MockFactory.newMocks(newConfig(), RunMode.SAFE_MODE)
  actionRegistry = new ActionRegistry()
  actionRegistry.registerActionProvider(
    "thread",
    new ThreadActions() as unknown as ActionProvider<ProcessingContext>,
  )
  dryRunMocks = MockFactory.newMocks(newConfig(), RunMode.DRY_RUN)
})

it("should provide actions in the action registry", () => {
  const actionNames = Array.from(actionRegistry.getActions().keys())
    .filter((v) => v.startsWith("thread."))
    .sort()
  expect(actionNames).toEqual([
    "thread.addLabel",
    "thread.markImportant",
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
  ThreadActions.markImportant(mocks.threadContext)
  expect(mocks.thread.markImportant).toBeCalled()
})

it("should not mark a thread as important (dryRun)", () => {
  ThreadActions.markImportant(dryRunMocks.threadContext)
  expect(dryRunMocks.thread.markImportant).not.toBeCalled()
})

it("should store a thread as PDF with header", () => {
  ThreadActions.storeAsPdfToGDrive(mocks.threadContext, {
    location: "thread.pdf",
    conflictStrategy: ConflictStrategy.REPLACE,
    skipHeader: false,
  })
  expect(mocks.blob.getAs).toBeCalledWith("application/pdf")
  expect(mocks.blob.getDataAsString()).toEqual("PDF-Contents")
  expect(mocks.thread.getFirstMessageSubject).toBeCalled()
})

it("should store a thread as PDF without header", () => {
  ThreadActions.storeAsPdfToGDrive(mocks.threadContext, {
    location: "thread.pdf",
    conflictStrategy: ConflictStrategy.REPLACE,
    skipHeader: true,
  })
  expect(mocks.blob.getAs).toBeCalledWith("application/pdf")
  expect(mocks.blob.getDataAsString()).toEqual("PDF-Contents")
  expect(mocks.thread.getMessages()[0].getSubject).not.toBeCalled()
})

it.todo("should use filenameTo as the output filename") // See PR #61
