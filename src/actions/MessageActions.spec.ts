import "reflect-metadata"
import { mock } from "jest-mock-extended"
import { MockFactory } from "../../test/mocks/MockFactory"
import { MessageActions } from "./MessageActions"
import { ActionRegistry } from "./ActionRegistry"
import { Config } from "../config/Config"

function getMocks(dryRun = true, config = new Config()) {
  // TODO: Simplify this
  const mockedGmailMessage = mock<GoogleAppsScript.Gmail.GmailMessage>()
  mockedGmailMessage.forward.mockReturnValue(mockedGmailMessage)
  const md = MockFactory.newMockObjects(dryRun)
  const mockedGasContext = MockFactory.newGasContextMock(md, dryRun)
  config.settings.dryRun = dryRun
  const mockedProcessingContext = MockFactory.newProcessingContextMock(
    mockedGasContext,
    config,
  )
  const mockedMessageContext = MockFactory.newMessageContextMock(
    MockFactory.newThreadContextMock(mockedProcessingContext),
    MockFactory.newDefaultMessageConfig(),
    mockedGmailMessage,
  )
  mockedMessageContext.processingContext.config.settings.dryRun = dryRun
  const messageActions = new MessageActions(mockedMessageContext)
  return { mockedGmailMessage, messageActions }
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
    "message.unstar",
  ])
})

it("should forward a message", () => {
  const { mockedGmailMessage, messageActions } = getMocks(false)
  messageActions.forward("test")
  expect(mockedGmailMessage.forward).toBeCalled()
})

it("should not forward a message (dryRun)", () => {
  const { mockedGmailMessage, messageActions } = getMocks(true)
  messageActions.forward("test")
  expect(mockedGmailMessage.forward).not.toBeCalled()
})
