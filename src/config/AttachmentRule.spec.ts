import { plainToInstance } from "class-transformer"
import { AttachmentRule } from "./AttachmentRule"
import { MockFactory } from "../../test/mocks/MockFactory"
import { Command } from "./Command"

it("should map values from JSON", () => {
  const attachmentRule = plainToInstance(
    AttachmentRule,
    MockFactory.newDefaultAttachmentRuleJson(true),
  )
  const expectedAttachmentRule = new AttachmentRule()
  expectedAttachmentRule.match.set("name", "Image-([0-9]+)\\.jpg")
  expectedAttachmentRule.match.set("contentType", "image/.+")
  const expectedCommand = new Command()
  expectedCommand.name = "file.storeToGDrive"
  expectedCommand.args = {
    folderType: "path",
    folder: "Folder2/Subfolder2/${message.subject.match.1}",
    filename: "${message.subject} - ${match.file.1}.jpg",
    onExists: "replace",
  }
  expectedAttachmentRule.commands = [expectedCommand]
  expect(attachmentRule).toEqual(expectedAttachmentRule)
})
