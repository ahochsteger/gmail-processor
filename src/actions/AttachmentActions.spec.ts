import { Mocks } from "../../test/mocks/Mocks"
import { ActionRegistry } from "./ActionRegistry"
import { AttachmentActions } from "./AttachmentActions"
import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { AttachmentConfig } from "../config/AttachmentConfig"
import { AttachmentContext } from "../context/AttachmentContext"
import { MessageContext } from "../context/MessageContext"
import { ThreadContext } from "../context/ThreadContext"
import { ThreadConfig } from "../config/ThreadConfig"
import { MessageConfig } from "../config/MessageConfig"
import { Config } from "../config/Config"

function getMocks(dryRun = true, config = new Config()) {
  const mocks = new Mocks(config, dryRun)
  const threadContext = new ThreadContext(
    mocks.processingContext,
    new ThreadConfig(),
    mocks.thread,
  )
  const messageContext = new MessageContext(
    threadContext,
    new MessageConfig(),
    mocks.message,
  )
  const attachmentContext = new AttachmentContext(
    messageContext,
    new AttachmentConfig(),
    mocks.attachment,
  )
  const attachmentActions = new AttachmentActions(attachmentContext)
  return {
    mocks,
    attachment: mocks.attachment,
    attachmentContext,
    attachmentActions,
  }
}

it("should provide actions in the action registry", () => {
  const { attachmentActions } = getMocks()
  expect(attachmentActions).not.toBeNull()

  const actionMap = ActionRegistry.getActionMap()
  expect(
    Object.keys(actionMap)
      .filter((v) => v.startsWith("attachment"))
      .sort(),
  ).toEqual(["attachment.storeToGDrive"])
})

it("should create a file", () => {
  const { mocks, attachmentActions } = getMocks(false)
  attachmentActions.storeToGDrive(
    "test-location",
    ConflictStrategy.REPLACE,
    "automated test",
  )
  expect(mocks.folder.createFile).toBeCalled()
})

it("should not create a file on dry-run", () => {
  const { mocks, attachmentActions } = getMocks(true)
  attachmentActions.storeToGDrive(
    "test-location",
    ConflictStrategy.REPLACE,
    "automated test",
  )
  expect(mocks.folder.createFile).not.toBeCalled()
})
