import { mock } from "jest-mock-extended"
import { ThreadActionProvider } from "./ThreadActionProvider"
import { Config } from "../config/Config"
import { MockFactory } from "../../test/mocks/MockFactory"
import { plainToClass } from "class-transformer"

const md = MockFactory.newMockObjects()
const gasContext = MockFactory.newGasContextMock(md)

it("should mark a thread as important", () => {
  const mockedGmailThread = mock<GoogleAppsScript.Gmail.GmailThread>()
  const mockThreadProcessor = MockFactory.newThreadProcessorMock(new Config())
  const messageActionProvider = new ThreadActionProvider(
    mockThreadProcessor.processingContext,
    console,
    false,
    mockedGmailThread,
  )
  messageActionProvider.markImportant()
  expect(mockedGmailThread.markImportant).toBeCalled()
})

it("should not mark a thread as important (dryRun)", () => {
  const mockedGmailThread = mock<GoogleAppsScript.Gmail.GmailThread>()
  const mockThreadProcessor = MockFactory.newThreadProcessorMock(new Config())
  const messageActionProvider = new ThreadActionProvider(
    mockThreadProcessor.processingContext,
    console,
    true,
    mockedGmailThread,
  )
  messageActionProvider.markImportant()
  expect(mockedGmailThread.markImportant).not.toBeCalled()
})

it("should mark a thread as processed by adding a label if processedMode='label'", () => {
  const config = plainToClass(Config, {
    settings: {
      processedLabel: "some-label",
      processedMode: "label",
    },
  })
  const threadProcessor = MockFactory.newThreadProcessorMock(config, gasContext)
  const mockedThread = MockFactory.newThreadMock()
  const messageActionProvider = new ThreadActionProvider(
    threadProcessor.processingContext,
    console,
    false,
    mockedThread,
  )
  messageActionProvider.markAsProcessed()
  expect(mockedThread.addLabel).toBeCalled()
})

it("should not add a label to a thread if processedMode='read'", () => {
  const config = plainToClass(Config, {
    settings: {
      processedMode: "read",
    },
  })
  const threadProcessor = MockFactory.newThreadProcessorMock(config, gasContext)
  const mockedThread = MockFactory.newThreadMock()
  const messageActionProvider = new ThreadActionProvider(
    threadProcessor.processingContext,
    console,
    false,
    mockedThread,
  )
  messageActionProvider.markAsProcessed()
  expect(mockedThread.addLabel).not.toBeCalled()
})

it.todo("should convert a thread to PDF")

it.todo("should use filenameTo as the output filename") // See PR #61
