import { Config } from "../config/Config";
import { mock } from "jest-mock-extended"
import { MockFactory } from "../../test/mocks/MockFactory";
import { MessageActionProvider } from './MessageActionProvider';

it("should forward a message", () => {
  const mockedGmailMessage = mock<GoogleAppsScript.Gmail.GmailMessage>()
  const mockedMessageProcessor = MockFactory.newMessageProcessorMock(new Config())
  const messageActionProvider = new MessageActionProvider(mockedMessageProcessor.processingContext, console, false, mockedGmailMessage)
  messageActionProvider.forward("test")
  expect(mockedGmailMessage.forward).toBeCalled()
})

it("should not forward a message (dryRun)", () => {
  const mockedGmailMessage = mock<GoogleAppsScript.Gmail.GmailMessage>()
  const mockedMessageProcessor = MockFactory.newMessageProcessorMock(new Config())
  const messageActionProvider = new MessageActionProvider(mockedMessageProcessor.processingContext, console, true, mockedGmailMessage)
  messageActionProvider.forward("test")
  expect(mockedGmailMessage.forward).not.toBeCalled()
})
