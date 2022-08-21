import { Config } from "../config/Config"
import { mock } from "jest-mock-extended"
import { MockFactory } from "../../test/mocks/MockFactory"
import { MessageActions } from "./MessageActions"

it("should forward a message", () => {
  const mockedGmailMessage = mock<GoogleAppsScript.Gmail.GmailMessage>()
  const mockedMessageProcessor = MockFactory.newMessageProcessorMock(
    new Config(),
  )
  const messageActions = new MessageActions(
    mockedMessageProcessor.processingContext,
    console,
    false,
    mockedGmailMessage,
  )
  messageActions.forward("test")
  expect(mockedGmailMessage.forward).toBeCalled()
})

it("should not forward a message (dryRun)", () => {
  const mockedGmailMessage = mock<GoogleAppsScript.Gmail.GmailMessage>()
  const mockedMessageProcessor = MockFactory.newMessageProcessorMock(
    new Config(),
  )
  const messageActions = new MessageActions(
    mockedMessageProcessor.processingContext,
    console,
    true,
    mockedGmailMessage,
  )
  messageActions.forward("test")
  expect(mockedGmailMessage.forward).not.toBeCalled()
})
