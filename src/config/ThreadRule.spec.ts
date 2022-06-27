import { plainToInstance } from "class-transformer"
import { MockFactory } from "../../test/mocks/MockFactory"
import { Command } from "./Command"
import { MessageFlag } from "./MessageFlag"
import { MessageRule } from "./MessageRule"
import { ThreadRule } from "./ThreadRule"

it("should map values from JSON", () => {
  const threadRule = plainToInstance(ThreadRule, MockFactory.newDefaultThreadRuleJson(true, true))
  const expectedThreadRule = new ThreadRule()
  expectedThreadRule.description = "A sample thread rule"
  expectedThreadRule.filter = "has:attachment from:example@example.com"
  const expectedCommand = new Command()
  expectedCommand.name = "file.storeToGDrive"
  expectedCommand.args = {
    folderType: "path",
    folder: "Folder2/Subfolder2/${message.subject.match.1}",
    filename: "${message.subject} - ${match.file.1}.jpg",
    onExists: "replace",
  }
  expectedThreadRule.commands = [ expectedCommand ]
  const expectedMessageRule = new MessageRule()
  expectedMessageRule.is = [ MessageFlag.UNREAD ]
  const matchMap = new Map<string,string>()
  matchMap.set("from", "(.+)@example.com")
  matchMap.set("subject", "Prefix - (.*) - Suffix(.*)")
  matchMap.set("to", "my\\.address\\+(.+)@gmail.com")
  expectedMessageRule.match = matchMap
  expectedThreadRule.messageRules = [ expectedMessageRule ]
  expect(threadRule).toEqual(expectedThreadRule)
})
