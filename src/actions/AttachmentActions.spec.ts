import { Config } from "../config/Config";
import "reflect-metadata"
import { MockFactory } from "../../test/mocks/MockFactory";
import { ActionRegistry } from './ActionRegistry';
import { AttachmentActions } from "./AttachmentActions";
import { ConflictStrategy } from "../adapter/GDriveAdapter";

function getMocks(dryRun=true,config=new Config()) {
  const mockedGmailAttachment = MockFactory.newAttachmentMock()
  const md = MockFactory.newMockObjects()
  const mockedGasContext = MockFactory.newGasContextMock(md)
  const mockedAttachmentProcessor = MockFactory.newAttachmentProcessorMock(
    config,
    mockedGasContext,
  )
  const context = mockedAttachmentProcessor.processingContext
  context.attachmentContext!.attachment = mockedGmailAttachment
  const attachmentActions = new AttachmentActions(
    context,
    console,
    dryRun,
  )
  return {
    mockedGmailAttachment,
    mockedAttachmentProcessor,
    attachmentActions,
    mockedGDriveApp: md.gdriveApp,
    mockedFolder: md.folder,
  }
}

it("should provide actions in the action registry", () => {
  const {attachmentActions} = getMocks()
  expect(attachmentActions).not.toBeNull()

  const actionMap = ActionRegistry.getActionMap()
  expect(Object.keys(actionMap).filter(v => v.startsWith("attachment")).sort()).toEqual([
    "attachment.storeToGDrive",
  ])
})

it("should create a file", () => {
  const {mockedFolder,attachmentActions} = getMocks(false)
  attachmentActions.storeToGDrive("test-location", ConflictStrategy.REPLACE, "automated test")
  expect(mockedFolder.createFile).toBeCalled()
})

it("should not create a file on dry-run", () => {
  const {mockedFolder,attachmentActions} = getMocks(true)
  attachmentActions.storeToGDrive("test-location", ConflictStrategy.REPLACE, "automated test")
  expect(mockedFolder.createFile).not.toBeCalled()
})
