import { MockFactory } from "../../test/mocks/MockFactory"
import { jsonToMessageConfig } from "./MessageConfig"
import { MessageFlag } from "./MessageFlag"

it("should expect a JSON config", () => {
  const messageConfig = jsonToMessageConfig(
    MockFactory.newDefaultMessageConfigJson(),
  )
  expect(messageConfig.match).toBeDefined()
  expect(messageConfig.match.from).toBe("(.+)@example.com")
  expect(messageConfig.match.is).toEqual([MessageFlag.UNREAD])
  expect(messageConfig.match.subject).toBe("Prefix - (.*) - Suffix(.*)")
  expect(messageConfig.match.to).toBe("my\\.address\\+(.+)@gmail.com")
})

it("should ensure nested object defaults", () => {
  const messageConfig = jsonToMessageConfig({
    match: {
      from: "test",
    },
  })
  expect(messageConfig.actions).toEqual([])
  expect(messageConfig.attachments).toEqual([])
  expect(messageConfig.match).toBeDefined()
  expect(messageConfig.match.from).toBe("test")
  expect(messageConfig.match.is).toEqual([])
  expect(messageConfig.match.subject).toBe(".*")
  expect(messageConfig.match.to).toBe(".*")
})