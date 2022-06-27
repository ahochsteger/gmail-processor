import { plainToInstance } from "class-transformer"
import { MessageFlag } from "./MessageFlag"
import { MessageRule } from "./MessageRule"
import { MockFactory } from "../../test/mocks/MockFactory"

it('should map values from JSON', () => {
    const messageRule = plainToInstance(MessageRule, MockFactory.newDefaultMailRuleJson())
    const expectedMessageRule = new MessageRule()
    expectedMessageRule.match = new Map<string,string>()
    expectedMessageRule.match.set("from", "(.+)@example.com")
    expectedMessageRule.match.set("subject", "Prefix - (.*) - Suffix(.*)")
    expectedMessageRule.match.set("to", "my\\.address\\+(.+)@gmail.com")
    expectedMessageRule.is = [
        MessageFlag.STARRED,
        MessageFlag.UNSTARRED,
        MessageFlag.READ,
        MessageFlag.UNREAD,
    ]
    expectedMessageRule.commands = []
    expectedMessageRule.attachmentRules = []
    expect(messageRule).toEqual(expectedMessageRule)
})
