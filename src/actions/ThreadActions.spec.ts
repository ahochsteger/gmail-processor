import { Mocks } from "../../test/mocks/Mocks"
import { ThreadActions } from "./ThreadActions"
import { Config } from "../config/Config"
import { plainToClass } from "class-transformer"
import { ActionRegistry } from "./ActionRegistry"
import { ThreadConfig } from "../config/ThreadConfig"
import { ThreadContext } from "../context/ThreadContext"

function getMocks(dryRun = true, config = new Config()) {
  const mocks = new Mocks(config, dryRun)
  const threadContext = new ThreadContext(
    mocks.processingContext,
    new ThreadConfig(),
    mocks.thread,
  )
  const threadActions = new ThreadActions(threadContext)
  return {
    mocks,
    thread: mocks.thread,
    threadContext,
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
  const { thread, threadActions } = getMocks(false)
  threadActions.markImportant()
  expect(thread.markImportant).toBeCalled()
})

it("should not mark a thread as important (dryRun)", () => {
  const { thread, threadActions } = getMocks(true)
  threadActions.markImportant()
  expect(thread.markImportant).not.toBeCalled()
})

it("should mark a thread as processed by adding a label if processedMode='label'", () => {
  const config = plainToClass(Config, {
    settings: {
      processedLabel: "some-label",
      processedMode: "label",
    },
  })
  const { thread, threadActions } = getMocks(false, config)
  threadActions.markProcessed()
  expect(thread.addLabel).toBeCalled()
})

it("should not add a label to a thread if processedMode='read'", () => {
  const config = plainToClass(Config, {
    settings: {
      processedMode: "read",
    },
  })
  const { thread, threadActions } = getMocks(false, config)
  threadActions.markProcessed()
  expect(thread.addLabel).not.toBeCalled()
})

it.todo("should convert a thread to PDF")

it.todo("should use filenameTo as the output filename") // See PR #61
