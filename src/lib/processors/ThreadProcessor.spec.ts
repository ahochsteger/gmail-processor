import { ContextMocks } from "../../test/mocks/ContextMocks"
import { MockFactory } from "../../test/mocks/MockFactory"
import { RunMode } from "../Context"
import { jsonToConfig } from "../config/Config"
import { MarkProcessedMethod } from "../config/SettingsConfig"
import { jsonToThreadConfig } from "../config/ThreadConfig"
import { ThreadProcessor } from "./ThreadProcessor"

it("should construct a GMail search query with globals (query, newerThan) and processedLabel", () => {
  const config = jsonToConfig({
    global: {
      thread: {
        match: {
          query: "some-global-query",
          newerThan: "3m",
        },
      },
    },
    settings: {
      markProcessedMethod: MarkProcessedMethod.ADD_THREAD_LABEL,
      markProcessedLabel: "some-label",
    },
  })
  const threadConfig = jsonToThreadConfig({
    match: {
      query: "some-thread-specific-query",
      newerThan: "2m",
    },
  })
  const ctx = ContextMocks.newProcessingContextMock(
    ContextMocks.newEnvContextMock(),
    config,
  )
  const matchConfig = ThreadProcessor.buildMatchConfig(
    ctx.proc.config.global.thread.match,
    threadConfig.match,
  )
  const actualQuery = ThreadProcessor.buildQuery(ctx, matchConfig)
  expect(actualQuery).toEqual(
    "some-global-query some-thread-specific-query -label:some-label newer_than:2m",
  )
})

it("should construct a GMail search query without globals and no processedLabel", () => {
  const config = jsonToConfig({
    settings: {
      markProcessedLabel: "",
      markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
    },
  })
  const threadConfig = jsonToThreadConfig({
    match: {
      query: "some-thread-specific-query",
    },
  })
  const mocks = MockFactory.newMocks(config, RunMode.DANGEROUS)
  const actualQuery = ThreadProcessor.buildQuery(
    mocks.processingContext,
    threadConfig.match,
  )
  expect(actualQuery).toEqual("some-thread-specific-query")
})
