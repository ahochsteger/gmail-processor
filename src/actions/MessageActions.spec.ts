import { Config } from "../config/Config"
import { mock } from "jest-mock-extended"
import { MockFactory } from "../../test/mocks/MockFactory"
import { MessageActions } from "./MessageActions"
import { actionRegistry } from './ActionRegistry';

function getMocks(dryRun=true,config=new Config()) {
  const mockedGmailMessage = mock<GoogleAppsScript.Gmail.GmailMessage>()
  const md = MockFactory.newMockObjects()
  const mockedGasContext = MockFactory.newGasContextMock(md)
  const mockedMessageProcessor = MockFactory.newMessageProcessorMock(
    config,
    mockedGasContext,
  )
  const messageActions = new MessageActions(
    mockedMessageProcessor.processingContext,
    console,
    dryRun,
    mockedGmailMessage,
  )
  return {mockedGmailMessage,mockedMessageProcessor,messageActions}
}

it("should provide actions in the action registry", () => {
  const {messageActions} = getMocks()
  expect(messageActions).not.toBeNull()

  const actionMap = actionRegistry.getActionMap()
  expect(Object.keys(actionMap).filter(v => v.startsWith("message")).sort()).toEqual([
    "message.forward",
    "message.markProcessed",
    "message.markRead",
    "message.markUnread",
    "message.moveToTrash",
    "message.star",
    "message.unstar",
  ])
})

it("should forward a message", () => {
  const {mockedGmailMessage,messageActions} = getMocks(false)
  messageActions.forward("test")
  expect(mockedGmailMessage.forward).toBeCalled()
})

it("should not forward a message (dryRun)", () => {
  const {mockedGmailMessage,messageActions} = getMocks(true)
  messageActions.forward("test")
  expect(mockedGmailMessage.forward).not.toBeCalled()
})
