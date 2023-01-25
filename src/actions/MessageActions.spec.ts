import { Mocks } from "../../test/mocks/Mocks"
import { MockFactory } from "../../test/mocks/MockFactory"
import { MessageActions } from "./MessageActions"
import { ActionRegistry } from "./ActionRegistry"
import { Config } from "../config/Config"
import { ConflictStrategy } from "../adapter/GDriveAdapter"

function getMocks(dryRun = true, config = new Config()) {
  const mocks = new Mocks(config, dryRun)
  const messageContext = MockFactory.newMessageContextMock(
    MockFactory.newThreadContextMock(mocks.processingContext),
    MockFactory.newDefaultMessageConfig(),
    mocks.message,
  )
  const messageActions = new MessageActions(messageContext)
  return {
    mocks,
    message: mocks.message,
    messageContext,
    messageActions,
  }
}

it("should provide actions in the action registry", () => {
  const { messageActions } = getMocks()
  expect(messageActions).not.toBeNull()

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
  const { message, messageActions } = getMocks(false)
  messageActions.forward("test")
  expect(message.forward).toBeCalled()
})

it("should not forward a message (dryRun)", () => {
  const { message, messageActions } = getMocks(true)
  messageActions.forward("test")
  expect(message.forward).not.toBeCalled()
})

it("should store a message as PDF with header", () => {
  const { message, messageActions, mocks } = getMocks(false)
  messageActions.storeAsPdfToGDrive("message", ConflictStrategy.REPLACE, false)
  expect(mocks.blob.getAs).toBeCalledWith("application/pdf")
  expect(mocks.blob.getDataAsString()).toEqual("PDF-Contents")
  expect(message.getSubject).toBeCalled()
})

it("should store a message as PDF without header", () => {
  const { message, messageActions, mocks } = getMocks(false)
  messageActions.storeAsPdfToGDrive("message", ConflictStrategy.REPLACE, true)
  expect(mocks.blob.getAs).toBeCalledWith("application/pdf")
  expect(mocks.blob.getDataAsString()).toEqual("PDF-Contents")
  expect(message.getSubject).not.toBeCalled()
})
