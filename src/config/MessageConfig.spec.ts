import { MockFactory } from "../../test/mocks/MockFactory"
import { MessageFlag } from "./MessageFlag"

it('should expect a JSON config', () => {
    const messageConfig = MockFactory.newDefaultMessageConfig()
    expect(messageConfig.match).toBeDefined()
    expect(messageConfig.match.from).toBe("(.+)@example.com")
    expect(messageConfig.match.is).toEqual([MessageFlag.UNREAD])
    expect(messageConfig.match.subject).toBe("Prefix - (.*) - Suffix(.*)")
    expect(messageConfig.match.to).toBe("my\\.address\\+(.+)@gmail.com")
})
