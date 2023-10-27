import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import {
  E2E_BASE_FOLDER_NAME,
  NEW_PDF_FILE_NAME,
} from "../../test/mocks/GDriveMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { ProcessingContext, RunMode } from "../Context"
import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { ActionProvider, ActionRegistry } from "./ActionRegistry"
import { ThreadActions } from "./ThreadActions"

let mocks: Mocks
let actionRegistry: ActionRegistry

beforeEach(() => {
  mocks = MockFactory.newMocks()
  actionRegistry = new ActionRegistry()
  actionRegistry.registerActionProvider(
    "thread",
    new ThreadActions() as unknown as ActionProvider<ProcessingContext>,
  )
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
    "thread.noop",
    "thread.removeLabel",
    "thread.storePDF",
  ])
})

it("should mark a thread as important", () => {
  ThreadActions.markImportant(mocks.threadContext)
  expect(mocks.thread.markImportant).toBeCalled()
})

it("should not mark a thread as important (dryRun)", () => {
  const dryRunMocks = MockFactory.newMocks(
    ConfigMocks.newDefaultConfig(),
    RunMode.DRY_RUN,
  )
  ThreadActions.markImportant(dryRunMocks.threadContext)
  expect(dryRunMocks.thread.markImportant).not.toBeCalled()
})

it("should store a thread as PDF", () => {
  const result = ThreadActions.storePDF(mocks.threadContext, {
    location: `${E2E_BASE_FOLDER_NAME}/${NEW_PDF_FILE_NAME}`,
    conflictStrategy: ConflictStrategy.REPLACE,
    skipHeader: false,
  })
  expect(mocks.newPdfBlob.getAs).toBeCalledWith("application/pdf")
  expect(mocks.newPdfBlob.getDataAsString()).toEqual("PDF Content")
  expect(result.file).toBeDefined()
})

it("should execute all actions using the action registry", () => {
  const ctx = mocks.threadContext
  // Execute all non-arg actions:
  ;[
    "thread.markImportant",
    "thread.markRead",
    "thread.markUnimportant",
    "thread.markUnread",
    "thread.moveToArchive",
    "thread.moveToInbox",
    "thread.moveToSpam",
    "thread.moveToTrash",
  ].forEach((actionName) => {
    actionRegistry.executeAction(ctx, actionName, {})
  })

  // Execute all label actions:
  ;["thread.addLabel", "thread.removeLabel"].forEach((actionName) => {
    actionRegistry.executeAction(ctx, actionName, {
      name: "my-label",
    })
  })

  // Execute all actions with special arguments:
  actionRegistry.executeAction(ctx, "thread.storePDF", {
    location: "/my-location",
    conflictStrategy: ConflictStrategy.REPLACE,
    description: "my description",
    skipHeader: false,
  })
})

it.todo("should use filenameTo as the output filename") // See PR #61
