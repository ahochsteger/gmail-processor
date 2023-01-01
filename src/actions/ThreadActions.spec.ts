import { mock } from "jest-mock-extended"
import { ThreadActions } from "./ThreadActions"
import { Config } from "../config/Config"
import { MockFactory } from "../../test/mocks/MockFactory"
import { plainToClass } from "class-transformer"
import { ActionRegistry } from "./ActionRegistry"
import { ThreadConfig } from "../config/ThreadConfig"
import { ThreadProcessor } from "../processors/ThreadProcessor"

function getMocks(dryRun = true, config = new Config()) {
  // TODO: Simplify this
  const mockedGmailThread = mock<GoogleAppsScript.Gmail.GmailThread>()
  const md = MockFactory.newMockObjects()
  const mockedGasContext = MockFactory.newGasContextMock(md)
  config.settings.dryRun = dryRun
  const mockedProcessingContext = MockFactory.newProcessingContextMock(
    mockedGasContext,
    config,
  )
  const threadConfig = new ThreadConfig()
  const mockedThreadContext = MockFactory.newThreadContextMock(
    mockedProcessingContext,
    threadConfig,
    mockedGmailThread,
  )
  const mockThreadProcessor = new ThreadProcessor(mockedProcessingContext)
  const threadActions = new ThreadActions(mockedThreadContext)
  return {
    mockedGmailThread,
    mockThreadProcessor,
    threadActions,
  }
}

it("should provide actions in the action registry", () => {
  const { threadActions } = getMocks()
  expect(threadActions).not.toBeNull()

  const actionMap = ActionRegistry.getActionMap()
  expect(
    Object.keys(actionMap)
      .filter((v) => v.startsWith("thread"))
      .sort(),
  ).toEqual([
    "thread.addLabel",
    "thread.markImportant",
    "thread.markProcessed",
    "thread.markRead",
    "thread.markUnimportant",
    "thread.markUnread",
    "thread.moveToArchive",
    "thread.moveToInbox",
    "thread.moveToSpam",
    "thread.moveToTrash",
    "thread.removeLabel",
    "thread.storeAsPdfToGDrive",
  ])
})

it("should mark a thread as important", () => {
  const { mockedGmailThread, threadActions } = getMocks(false)
  threadActions.markImportant()
  expect(mockedGmailThread.markImportant).toBeCalled()
})

it("should not mark a thread as important (dryRun)", () => {
  const { mockedGmailThread, threadActions } = getMocks(true)
  threadActions.markImportant()
  expect(mockedGmailThread.markImportant).not.toBeCalled()
})

it("should mark a thread as processed by adding a label if processedMode='label'", () => {
  const config = plainToClass(Config, {
    settings: {
      processedLabel: "some-label",
      processedMode: "label",
    },
  })
  const { mockedGmailThread, threadActions } = getMocks(false, config)
  threadActions.markProcessed()
  expect(mockedGmailThread.addLabel).toBeCalled()
})

it("should not add a label to a thread if processedMode='read'", () => {
  const config = plainToClass(Config, {
    settings: {
      processedMode: "read",
    },
  })
  const { mockedGmailThread, threadActions } = getMocks(false, config)
  threadActions.markProcessed()
  expect(mockedGmailThread.addLabel).not.toBeCalled()
})

it.todo("should convert a thread to PDF")

it.todo("should use filenameTo as the output filename") // See PR #61
