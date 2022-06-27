import { plainToInstance } from "class-transformer"
import { MessageFlag } from "./MessageFlag"
import { MessageRule } from "./MessageRule"
import { MockFactory } from "../../test/mocks/MockFactory"
import { Command } from "./Command"
import { AttachmentRule } from "./AttachmentRule"

it("should map values from JSON", () => {
  const messageRule = plainToInstance(
    MessageRule,
    MockFactory.newDefaultMessageRuleJson(true,true),
  )
  const expectedMessageRule = new MessageRule()
  expectedMessageRule.match = new Map<string, string>()
  expectedMessageRule.match.set("from", "(.+)@example.com")
  expectedMessageRule.match.set("subject", "Prefix - (.*) - Suffix(.*)")
  expectedMessageRule.match.set("to", "my\\.address\\+(.+)@gmail.com")
  expectedMessageRule.is = [ MessageFlag.UNREAD ]
  const expectedCommand = new Command()
  expectedCommand.name = "file.storeToGDrive"
  expectedCommand.args = {
    folderType: "path",
    folder: "Folder2/Subfolder2/${message.subject.match.1}",
    filename: "${message.subject} - ${match.file.1}.jpg",
    onExists: "replace",
  }
  expectedMessageRule.commands = [expectedCommand]
  const expectedAttachmentRule = new AttachmentRule()
  expectedAttachmentRule.match.set("name", "Image-([0-9]+)\\.jpg")
  expectedAttachmentRule.match.set("contentType", "image/.+")
  expectedMessageRule.attachmentRules = [expectedAttachmentRule]
  expect(messageRule).toEqual(expectedMessageRule)
})
