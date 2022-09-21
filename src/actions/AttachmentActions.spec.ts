import { Config } from "../config/Config";
import "reflect-metadata"
import { MockFactory } from "../../test/mocks/MockFactory";
import { actionRegistry } from './ActionRegistry';
import { AttachmentActions } from "./AttachmentActions";

function getMocks(dryRun=true,config=new Config()) {
  const mockedGmailAttachment = MockFactory.newAttachmentMock()
  const md = MockFactory.newMockObjects()
  const mockedGasContext = MockFactory.newGasContextMock(md)
  const mockedAttachmentProcessor = MockFactory.newThreadProcessorMock(
    config,
    mockedGasContext,
  )
  const attachmentActions = new AttachmentActions(
    mockedAttachmentProcessor.processingContext,
    console,
    dryRun,
    mockedGmailAttachment,
  )
  return {
    mockedGmailAttachment,
    mockedAttachmentProcessor,
    attachmentActions,
  }
}

it("should provide actions in the action registry", () => {
  const {attachmentActions} = getMocks()
  expect(attachmentActions).not.toBeNull()

  const actionMap = actionRegistry.getActionMap()
  expect(Object.keys(actionMap).filter(v => v.startsWith("attachment")).sort()).toEqual([
    "attachment.storeToGDrive",
    "attachment.testAction",
  ])
})
