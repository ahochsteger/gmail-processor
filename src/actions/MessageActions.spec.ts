import { Mocks } from "../../test/mocks/Mocks"
import { ActionRegistry } from "./ActionRegistry"
import { Config } from "../config/Config"
import { ConflictStrategy } from "../adapter/GDriveAdapter"

let mocks: Mocks
let dryRunMocks: Mocks

beforeEach(() => {
  mocks = new Mocks(new Config(), false)
  dryRunMocks = new Mocks(new Config(), true)
})

it("should provide actions in the action registry", () => {
  expect(mocks.messageActions).not.toBeNull()

  const actionMap = ActionRegistry.getActionMap()
  expect(
    Object.keys(actionMap)
      .filter((v) => v.startsWith("message"))
      .sort(),
  ).toEqual([
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
  mocks.messageActions.forward("test")
  expect(mocks.message.forward).toBeCalled()
})

it("should not forward a message (dryRun)", () => {
  dryRunMocks.messageActions.forward("test")
  expect(dryRunMocks.message.forward).not.toBeCalled()
})

it("should store a message as PDF with header", () => {
  mocks.messageActions.storeAsPdfToGDrive(
    "message",
    ConflictStrategy.REPLACE,
    false,
  )
  expect(mocks.blob.getAs).toBeCalledWith("application/pdf")
  expect(mocks.blob.getDataAsString()).toEqual("PDF-Contents")
  expect(mocks.message.getSubject).toBeCalled()
})

it("should store a message as PDF without header", () => {
  mocks.messageActions.storeAsPdfToGDrive(
    "message",
    ConflictStrategy.REPLACE,
    true,
  )
  expect(mocks.blob.getAs).toBeCalledWith("application/pdf")
  expect(mocks.blob.getDataAsString()).toEqual("PDF-Contents")
  expect(mocks.message.getSubject).not.toBeCalled()
})
