import { MockFactory } from "../../test/mocks/MockFactory"
import { ActionRegistry } from "./ActionRegistry"
import { AttachmentActions } from "./AttachmentActions"
import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { AttachmentProcessor } from "../processors/AttachmentProcessor"
import { AttachmentConfig } from "../config/AttachmentConfig"
import { AttachmentContext } from "../context/AttachmentContext"
import { MessageContext } from "../context/MessageContext"
import { ThreadContext } from "../context/ThreadContext"
import { ProcessingContext } from "../context/ProcessingContext"
import { ThreadConfig } from "../config/ThreadConfig"
import { MessageConfig } from "../config/MessageConfig"
import { Config } from "../config/Config"
import { GoogleAppsScriptContext } from "../context/GoogleAppsScriptContext"

function getMocks(dryRun = true) {
  const mockedGmailAttachment = MockFactory.newAttachmentMock()
  const md = MockFactory.newMockObjects() // TODO: Replace with mocked newGoogleAppsScriptContext to keep instances consistent
  const mockedMessageContext = new MessageContext(
    new ThreadContext(
      new ProcessingContext(
        new GoogleAppsScriptContext(
          md.gmailApp,
          md.gdriveApp,
          md.console,
          md.utilities,
          md.spreadsheetApp,
          md.cacheService,
        ),
        new Config(),
        dryRun,
      ),
      new ThreadConfig(),
      MockFactory.newThreadMock(),
    ),
    new MessageConfig(),
    MockFactory.newMessageMock(),
  )
  const mockedAttachmentProcessor = new AttachmentProcessor(
    mockedMessageContext,
  )
  const attachmentContext = new AttachmentContext(
    mockedMessageContext,
    new AttachmentConfig(),
    mockedGmailAttachment,
  )
  const attachmentActions = new AttachmentActions(attachmentContext)
  return {
    mockedGmailAttachment,
    mockedAttachmentProcessor,
    attachmentActions,
    mockedGDriveApp: md.gdriveApp,
    mockedFolder: md.folder,
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
  const { mockedFolder, attachmentActions } = getMocks(false)
  attachmentActions.storeToGDrive(
    "test-location",
    ConflictStrategy.REPLACE,
    "automated test",
  )
  expect(mockedFolder.createFile).toBeCalled()
})

it("should not create a file on dry-run", () => {
  const { mockedFolder, attachmentActions } = getMocks(true)
  attachmentActions.storeToGDrive(
    "test-location",
    ConflictStrategy.REPLACE,
    "automated test",
  )
  expect(mockedFolder.createFile).not.toBeCalled()
})
