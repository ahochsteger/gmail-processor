import { Config } from "../config/Config"
import { MockFactory } from "../../test/mocks/MockFactory"
import { ThreadConfig } from "../config/ThreadConfig"
import { anyString, mock } from "jest-mock-extended"
import { plainToClass } from "class-transformer"

const md = MockFactory.newMockObjects()
const gasContext = MockFactory.newGasContextMock(md)

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
  const threadProcessor = MockFactory.newThreadProcessorMock(config, gasContext)
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
  const threadProcessor = MockFactory.newThreadProcessorMock(config, gasContext)
  const actualQuery = threadProcessor.getQueryFromThreadConfig(threadConfig)
  expect(actualQuery).toBe("some-thread-specific-query")
})

it("should mark thread as processed with label if processedLabel is given", () => {
  const config = plainToClass(Config, {
    settings: {
      processedLabel: "some-label",
    },
  })
  const threadProcessor = MockFactory.newThreadProcessorMock(config, gasContext)
  const mockedThread = MockFactory.newThreadMock()
  const mockedLabel = mock<GoogleAppsScript.Gmail.GmailLabel>()
  md.gmailApp.getUserLabelByName
    .calledWith(anyString())
    .mockReturnValue(mockedLabel)
  threadProcessor.markThreadAsProcessed(mockedThread)
  expect(md.gmailApp.getUserLabelByName).toBeCalled()
})

it("should not mark thread as processed with label if processedLabel is not given", () => {
  const config = plainToClass(Config, {
    settings: {
      processedLabel: "",
    },
  })
  const threadProcessor = MockFactory.newThreadProcessorMock(config, gasContext)
  const mockedThread = MockFactory.newThreadMock()
  const mockedLabel = mock<GoogleAppsScript.Gmail.GmailLabel>()
  md.gmailApp.getUserLabelByName
    .calledWith(anyString())
    .mockReturnValue(mockedLabel)
  threadProcessor.markThreadAsProcessed(mockedThread)
  expect(md.gmailApp.getUserLabelByName).not.toBeCalled()
})
