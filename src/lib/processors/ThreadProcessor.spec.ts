import { MockFactory } from "../../test/mocks/MockFactory"
import { RunMode } from "../Context"
import { jsonToConfig } from "../config/Config"
import { jsonToThreadConfig } from "../config/ThreadConfig"
import { ThreadProcessor } from "./ThreadProcessor"

it("should construct a GMail search query with globals (query, newerThan) and processedLabel", () => {
  const config = jsonToConfig({
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
  const threadConfig = jsonToThreadConfig({
    match: {
      query: "some-thread-specific-query",
    },
  })
  const ctx = MockFactory.newProcessingContextMock(
    MockFactory.newEnvContextMock(),
    config,
  )
  const actualQuery = ThreadProcessor.getQueryFromThreadConfig(
    ctx,
    threadConfig,
  )
  expect(actualQuery).toBe(
    "some-global-query some-thread-specific-query -label:some-label newer_than:3m",
  )
})

it("should construct a GMail search query without globals and no processedLabel", () => {
  const config = jsonToConfig({
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
  const threadConfig = jsonToThreadConfig({
    match: {
      query: "some-thread-specific-query",
    },
  })
  const mocks = MockFactory.newMocks(config, RunMode.DANGEROUS)
  const actualQuery = ThreadProcessor.getQueryFromThreadConfig(
    mocks.processingContext,
    threadConfig,
  )
  expect(actualQuery).toBe("some-thread-specific-query")
})
