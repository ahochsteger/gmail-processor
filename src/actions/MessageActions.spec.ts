import { ActionProvider, ActionRegistry } from "./ActionRegistry"
import { Config } from "../config/Config"
import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { ProcessingContext } from "../Context"

let mocks: Mocks
let dryRunMocks: Mocks
let actionRegistry: ActionRegistry

beforeEach(() => {
  mocks = MockFactory.newMocks(new Config(), false)
  actionRegistry = new ActionRegistry()
  actionRegistry.registerActionProvider(
    "message",
    mocks.messageActions as unknown as ActionProvider<ProcessingContext>,
  )
  dryRunMocks = MockFactory.newMocks(new Config(), true)
})

it("should provide actions in the action registry", () => {
  expect(mocks.messageActions).not.toBeNull()

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
  mocks.messageActions.forward(mocks.messageContext, { to: "test" })
  expect(mocks.message.forward).toBeCalled()
})

it("should not forward a message (dryRun)", () => {
  dryRunMocks.messageActions.forward(dryRunMocks.messageContext, { to: "test" })
  expect(dryRunMocks.message.forward).not.toBeCalled()
})

it("should store a message as PDF with header", () => {
  mocks.messageActions.storeAsPdfToGDrive(mocks.messageContext, {
    location: "message",
    conflictStrategy: ConflictStrategy.REPLACE,
    skipHeader: false,
  })
  expect(mocks.blob.getAs).toBeCalledWith("application/pdf")
  expect(mocks.blob.getDataAsString()).toEqual("PDF-Contents")
  expect(mocks.message.getSubject).toBeCalled()
})

it("should store a message as PDF without header", () => {
  mocks.messageActions.storeAsPdfToGDrive(mocks.messageContext, {
    location: "message",
    conflictStrategy: ConflictStrategy.REPLACE,
    skipHeader: true,
  })
  expect(mocks.blob.getAs).toBeCalledWith("application/pdf")
  expect(mocks.blob.getDataAsString()).toEqual("PDF-Contents")
  expect(mocks.message.getSubject).not.toBeCalled()
})
