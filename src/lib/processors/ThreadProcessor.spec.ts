import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import { ContextMocks } from "../../test/mocks/ContextMocks"
import { GMailMocks } from "../../test/mocks/GMailMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { ProcessingStatus } from "../Context"
import { OrderDirection } from "../config/CommonConfig"
import { newConfig } from "../config/Config"
import { MarkProcessedMethod } from "../config/SettingsConfig"
import { ThreadOrderField, newThreadConfig } from "../config/ThreadConfig"
import { ThreadProcessor } from "./ThreadProcessor"

let mocks: Mocks

beforeEach(() => {
  mocks = MockFactory.newMocks()
})

it("should construct a GMail search query with globals (query, newerThan) and processedLabel", () => {
  const config = newConfig({
    ...ConfigMocks.newDefaultConfigJson(),
    global: {
      thread: {
        match: {
          query: "some-global-query newer_than:3m",
        },
      },
    },
    settings: {
      markProcessedMethod: MarkProcessedMethod.ADD_THREAD_LABEL,
      markProcessedLabel: "some-label",
    },
  })
  const threadConfig = newThreadConfig({
    match: {
      query: "some-thread-specific-query newer_than:2m",
    },
  })
  const ctx = ContextMocks.newProcessingContextMock(
    ContextMocks.newEnvContextMock(),
    config,
  )
  const matchConfig = ThreadProcessor.buildMatchConfig(
    ctx,
    ctx.proc.config.global.thread.match,
    threadConfig.match,
  )
  const actualQuery = ThreadProcessor.buildQuery(matchConfig)
  expect(actualQuery).toEqual(
    "some-global-query newer_than:3m -label:some-label some-thread-specific-query newer_than:2m",
  )
})

it("should construct a GMail search query without globals and no processedLabel", () => {
  const config = newConfig({
    settings: {
      markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
    },
    threads: [
      {
        match: {
          query: "some-thread-specific-query",
        },
      },
    ],
  })
  const actualQuery = ThreadProcessor.buildQuery(config.threads[0].match)
  expect(actualQuery).toEqual("some-thread-specific-query")
})

it("should process thread configs", () => {
  const result = ThreadProcessor.processConfigs(
    mocks.processingContext,
    mocks.processingContext.proc.config.threads,
  )
  expect(result).toMatchObject({
    status: ProcessingStatus.OK,
  })
})

it("should process a matching thread config", () => {
  const result = ThreadProcessor.processConfigs(mocks.processingContext, [
    newThreadConfig({
      match: {
        firstMessageSubject: ".*",
        labels: ".*", // TODO: Check sorted/non-sorted match!
      },
    }),
  ])
  expect(result.status).toEqual(ProcessingStatus.OK)
  expect(result.processedThreads).toEqual(1)
})

it("should process a non-matching thread config", () => {
  const result = ThreadProcessor.processConfigs(mocks.processingContext, [
    newThreadConfig({
      match: {
        firstMessageSubject: "non-matching-thread",
        labels: "non-matching-labels",
      },
    }),
  ])
  expect(result).toMatchObject({
    status: ProcessingStatus.OK, // TODO: Consider a separate status here (e.g. NO_MATCH)
  })
})

it("should process an thread entity", () => {
  const result = ThreadProcessor.processEntity(mocks.threadContext)
  expect(result).toMatchObject({
    status: ProcessingStatus.OK,
  })
})

describe("order threads", () => {
  let threads: GoogleAppsScript.Gmail.GmailThread[]
  beforeAll(() => {
    jest.useRealTimers()
    threads = [
      GMailMocks.newThreadMock({
        id: "t1",
        lastMessageDate: new Date(2024, 5, 10),
      }),
      GMailMocks.newThreadMock({
        id: "t2",
        lastMessageDate: new Date(2024, 5, 9),
      }),
      GMailMocks.newThreadMock({
        id: "t3",
        lastMessageDate: new Date(2024, 5, 11),
      }),
    ]
  })
  it("should order threads ascending", () => {
    threads = ThreadProcessor.ordered(
      threads,
      { orderBy: ThreadOrderField.DATE, orderDirection: OrderDirection.ASC },
      ThreadProcessor.orderRules,
    )
    expect(threads.map((t) => t.getId())).toEqual(["t2", "t1", "t3"])
  })
  it("should order threads ascending", () => {
    threads = ThreadProcessor.ordered(
      threads,
      { orderBy: ThreadOrderField.DATE, orderDirection: OrderDirection.DESC },
      ThreadProcessor.orderRules,
    )
    expect(threads.map((t) => t.getId())).toEqual(["t3", "t1", "t2"])
  })
})
