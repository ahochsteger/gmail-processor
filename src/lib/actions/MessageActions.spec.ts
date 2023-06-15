import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { ProcessingContext, RunMode } from "../Context"
import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { newConfig } from "../config/Config"
import { ActionProvider, ActionRegistry } from "./ActionRegistry"
import { MessageActions } from "./MessageActions"

let mocks: Mocks
let actionRegistry: ActionRegistry

beforeEach(() => {
  mocks = MockFactory.newMocks(newConfig(), RunMode.DANGEROUS)
  actionRegistry = new ActionRegistry()
  actionRegistry.registerActionProvider(
    "message",
    new MessageActions() as ActionProvider<ProcessingContext>,
  )
})

it("should provide actions in the action registry", () => {
  expect(MessageActions).not.toBeNull()

  const actionNames = Array.from(actionRegistry.getActions().keys())
    .filter((v) => v.startsWith("message."))
    .sort()
  expect(actionNames).toEqual([
    "message.forward",
    "message.markRead",
    "message.markUnread",
    "message.moveToTrash",
    "message.star",
    "message.storeAsPdfToGDrive",
    "message.unstar",
  ])
})

it("should forward a message", () => {
  MessageActions.forward(mocks.messageContext, { to: "test" })
  expect(mocks.message.forward).toBeCalled()
})

it("should not forward a message (dry-run)", () => {
  const dryRunMocks = MockFactory.newMocks(newConfig(), RunMode.DRY_RUN)
  MessageActions.forward(dryRunMocks.messageContext, { to: "test" })
  expect(dryRunMocks.message.forward).not.toBeCalled()
})

it("should store a message as PDF", () => {
  const result = MessageActions.storeAsPdfToGDrive(mocks.messageContext, {
    location: "message",
    conflictStrategy: ConflictStrategy.REPLACE,
    skipHeader: false,
  })
  expect(mocks.blob.getAs).toBeCalledWith("application/pdf")
  expect(mocks.blob.getDataAsString()).toEqual("PDF-Contents")
  expect(result.file).toBeDefined()
})

it("should execute all actions using the action registry", () => {
  const ctx = mocks.messageContext
  const nonArgActions = [
    "message.forward",
    "message.markRead",
    "message.markUnread",
    "message.moveToTrash",
    "message.star",
    "message.unstar",
  ]
  // Execute all non-arg actions:
  nonArgActions.forEach((actionName) => {
    actionRegistry.executeAction(ctx, actionName, {})
  })
  // Execute all actions with arguments:
  actionRegistry.executeAction(ctx, "message.forward", {
    to: "some.email@example.com",
  })
  actionRegistry.executeAction(ctx, "message.storeAsPdfToGDrive", {
    location: "my-location",
    conflictStrategy: ConflictStrategy.REPLACE,
    description: "my description",
    skipHeader: false,
  })
})
