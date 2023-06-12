import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import { jsonToThreadConfig } from "./ThreadConfig"

it("should expect a JSON config", () => {
  const threadConfig = jsonToThreadConfig(
    ConfigMocks.newDefaultThreadConfigJson(),
  )
  expect(threadConfig.match).toBeDefined()
  expect(threadConfig.match.query).toBe(
    "has:attachment from:example@example.com",
  )
})

it("should ensure nested object defaults", () => {
  const threadConfig = jsonToThreadConfig({
    match: {
      query: "test",
    },
  })
  expect(threadConfig.actions).toEqual([])
  expect(threadConfig.messages).toEqual([])
  expect(threadConfig.match).toBeDefined()
  expect(threadConfig.match.query).toBe("test")
  expect(threadConfig.match.newerThan).toBe("")
  expect(threadConfig.match.minMessageCount).toBe(1)
  expect(threadConfig.match.maxMessageCount).toBe(-1)
})
