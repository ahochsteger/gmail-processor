import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { AttachmentContext, ProcessingContext, RunMode } from "../Context"
import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { newConfig } from "../config/Config"
import { ActionProvider, ActionRegistry } from "./ActionRegistry"
import { AttachmentActions } from "./AttachmentActions"

let mocks: Mocks
let actionRegistry: ActionRegistry
let actionProvider: ActionProvider<AttachmentContext>

beforeEach(() => {
  mocks = MockFactory.newMocks(newConfig(), RunMode.DANGEROUS)
  actionRegistry = new ActionRegistry()
  actionProvider = new AttachmentActions()
  actionRegistry.registerActionProvider(
    "attachment",
    actionProvider as ActionProvider<ProcessingContext>,
  )
})

it("should provide actions in the action registry", () => {
  const actionNames = Array.from(actionRegistry.getActions().keys())
    .filter((v) => v.startsWith("attachment."))
    .sort()
  expect(actionNames).toEqual(["attachment.storeToGDrive"])
})

it("should provide attachment.storeToGDrive in the action registry", () => {
  const actual = actionRegistry.getAction("attachment.storeToGDrive")
  const expected = AttachmentActions.storeToGDrive
  expect(actual).toEqual(expected)
})

it("should create a file", () => {
  AttachmentActions.storeToGDrive(mocks.attachmentContext, {
    location: "test-file.txt",
    conflictStrategy: ConflictStrategy.REPLACE,
    description: "automated test",
  })
  expect(mocks.rootFolder.createFile).toBeCalled()
})

it("should not create a file on dry-run", () => {
  const dryRunMocks = MockFactory.newMocks(newConfig(), RunMode.DRY_RUN)
  AttachmentActions.storeToGDrive(dryRunMocks.attachmentContext, {
    location: "test-location",
    conflictStrategy: ConflictStrategy.REPLACE,
    description: "automated test",
  })
  expect(mocks.folder.createFile).not.toBeCalled()
})

it("should execute all actions using the action registry", () => {
  const ctx = mocks.attachmentContext
  actionRegistry.executeAction(ctx, "attachment.storeToGDrive", {
    location: "my-location",
    conflictStrategy: ConflictStrategy.REPLACE,
    description: "my description",
  })
})
