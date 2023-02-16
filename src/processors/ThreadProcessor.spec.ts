import { Config } from "../config/Config"
import { ThreadConfig } from "../config/ThreadConfig"
import { plainToClass } from "class-transformer"
import { ThreadProcessor } from "./ThreadProcessor"
import { MockFactory } from "../../test/mocks/MockFactory"

it("should construct a GMail search query with globals (query, newerThan) and processedLabel", () => {
  const config = plainToClass(Config, {
    global: {
      match: {
        query: "some-global-query",
        newerThan: "3m",
      },
    },
    settings: {
      processedLabel: "some-label",
    },
  })
  const threadConfig = plainToClass(ThreadConfig, {
    match: {
      query: "some-thread-specific-query",
    },
  })
  const mocks = MockFactory.newMocks(config, false)
  const threadProcessor = new ThreadProcessor(mocks.processingContext)
  const actualQuery = threadProcessor.getQueryFromThreadConfig(threadConfig)
  expect(actualQuery).toBe(
    "some-global-query some-thread-specific-query -label:some-label newer_than:3m",
  )
})

it("should construct a GMail search query without globals and no processedLabel", () => {
  const config = plainToClass(Config, {
    global: {
      match: {
        query: "",
        newerThan: "",
      },
    },
    settings: {
      processedLabel: "",
    },
  })
  const threadConfig = plainToClass(ThreadConfig, {
    match: {
      query: "some-thread-specific-query",
    },
  })
  const mocks = MockFactory.newMocks(config, false)
  const threadProcessor = new ThreadProcessor(mocks.processingContext)
  const actualQuery = threadProcessor.getQueryFromThreadConfig(threadConfig)
  expect(actualQuery).toBe("some-thread-specific-query")
})
