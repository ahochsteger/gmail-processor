import { MockFactory } from "../../test/mocks/MockFactory"
import { ThreadConfig } from "./ThreadConfig"
import { plainToClass } from "class-transformer"

it("should expect a JSON config", () => {
  const threadConfig = plainToClass(
    ThreadConfig,
    MockFactory.newDefaultThreadConfig(),
  )
  expect(threadConfig.match).toBeDefined()
  expect(threadConfig.match.query).toBe(
    "has:attachment from:example@example.com",
  )
})

it("should ensure nested object defaults", () => {
  const threadConfig = plainToClass(ThreadConfig, {
    match: {
      query: "test",
    },
  })
  expect(threadConfig.actions).toEqual([])
  expect(threadConfig.handler).toEqual([])
  expect(threadConfig.match).toBeDefined()
  expect(threadConfig.match.query).toBe("test")
  expect(threadConfig.match.newerThan).toBe("")
  expect(threadConfig.match.minMessageCount).toBe(1)
  expect(threadConfig.match.maxMessageCount).toBe(-1)
})
