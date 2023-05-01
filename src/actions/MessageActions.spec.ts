import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { ProcessingContext, RunMode } from "../Context"
import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { Config } from "../config/Config"
import { ActionProvider, ActionRegistry } from "./ActionRegistry"
import { MessageActions } from "./MessageActions"

let mocks: Mocks
let dryRunMocks: Mocks
let actionRegistry: ActionRegistry

beforeEach(() => {
  mocks = MockFactory.newMocks(new Config(), RunMode.SAFE_MODE)
  actionRegistry = new ActionRegistry()
  actionRegistry.registerActionProvider(
    "message",
    new MessageActions() as ActionProvider<ProcessingContext>,
  )
  dryRunMocks = MockFactory.newMocks(new Config(), RunMode.DRY_RUN)
})

it("should provide actions in the action registry", () => {
  expect(MessageActions).not.toBeNull()

  const actionNames = Array.from(actionRegistry.getActions().keys())
    .filter((v) => v.startsWith("message."))
    .sort()
  expect(actionNames).toEqual([
    "message.forward",
    "message.markProcessed",
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
  MessageActions.forward(dryRunMocks.messageContext, { to: "test" })
  expect(dryRunMocks.message.forward).not.toBeCalled()
})

it("should store a message as PDF with header", () => {
  MessageActions.storeAsPdfToGDrive(mocks.messageContext, {
    location: "message",
    conflictStrategy: ConflictStrategy.REPLACE,
    skipHeader: false,
  })
  expect(mocks.blob.getAs).toBeCalledWith("application/pdf")
  expect(mocks.blob.getDataAsString()).toEqual("PDF-Contents")
  expect(mocks.message.getSubject).toBeCalled()
})

it("should store a message as PDF without header", () => {
  MessageActions.storeAsPdfToGDrive(mocks.messageContext, {
    location: "message",
    conflictStrategy: ConflictStrategy.REPLACE,
    skipHeader: true,
  })
  expect(mocks.blob.getAs).toBeCalledWith("application/pdf")
  expect(mocks.blob.getDataAsString()).toEqual("PDF-Contents")
  expect(mocks.message.getSubject).not.toBeCalled()
})
