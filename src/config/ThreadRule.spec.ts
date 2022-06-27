import { plainToInstance } from "class-transformer"
import { ThreadRule } from "./ThreadRule"

it('should map values from JSON', () => {
    const threadRule = plainToInstance(ThreadRule, {
        filter: "has:attachment from:example@example.com"
    })
    const expectedThreadRule = new ThreadRule()
    expectedThreadRule.filter = "has:attachment from:example@example.com"
    expect(threadRule).toEqual(expectedThreadRule)
})
