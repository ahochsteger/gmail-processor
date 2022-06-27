import { plainToInstance } from "class-transformer"
import { AttachmentRule } from "./AttachmentRule"
import { MockFactory } from "../../test/mocks/MockFactory"

it('should map values from JSON', () => {
    const attachmentRule = plainToInstance(AttachmentRule, MockFactory.newDefaultAttachmentRuleJson())
    const expectedAttachmentRule = new AttachmentRule()
    expectedAttachmentRule.match.set("name", "Image-([0-9]+)\\.jpg")
    expectedAttachmentRule.match.set("contentType", "image/.+")
    expect(attachmentRule).toEqual(expectedAttachmentRule)
})
