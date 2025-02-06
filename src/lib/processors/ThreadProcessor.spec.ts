import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import { ContextMocks } from "../../test/mocks/ContextMocks"
import { GMailMocks } from "../../test/mocks/GMailMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { ProcessingStatus } from "../Context"
import { OrderDirection } from "../config/CommonConfig"
import { newConfig } from "../config/Config"
import { MarkProcessedMethod } from "../config/SettingsConfig"
import { ThreadOrderField, newThreadConfig } from "../config/ThreadConfig"
import { ThreadMatchConfig } from "../config/ThreadMatchConfig"
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

describe("match()", () => {
  it("should match messages with matching parameters", () => {
    const matchExamples: { config: ThreadMatchConfig; expected: string[] }[] = [
      {
        config: {
          firstMessageSubject: ".*-2",
        },
        expected: ["thread-2"],
      },
      {
        config: {
          labels: "thread,thread-1",
        },
        expected: ["thread-1"],
      },
      {
        config: {
          maxMessageCount: 1,
        },
        expected: ["thread-1", "thread-3"],
      },
      {
        config: {
          minMessageCount: 2,
        },
        expected: ["thread-2"],
      },
    ]
    const threads = [
      GMailMocks.newThreadMock({
        firstMessageSubject: "thread-1",
        labels: ["thread", "thread-1"],
        messages: [
          {
            from: "from1@example.com",
            subject: "thread-1",
            to: "to1@example.com",
            isStarred: false,
            isUnread: true,
            body: "Test\nmessage 1 of thread 1",
          },
        ],
      }),
      GMailMocks.newThreadMock({
        firstMessageSubject: "thread-2",
        labels: ["thread", "thread-2"],
        messages: [
          {
            from: "from1@example.com",
            subject: "thread-2",
            to: "to1@example.com",
            isStarred: false,
            isUnread: true,
            body: "Test\nmessage 1 of thread 2",
          },
          {
            from: "from1@example.com",
            subject: "thread-2",
            to: "to1@example.com",
            isStarred: false,
            isUnread: true,
            body: "Test\nmessage 2 of thread 2",
          },
        ],
      }),
      GMailMocks.newThreadMock({
        firstMessageSubject: "thread-3",
        labels: [],
        messages: [
          {
            from: "from1@example.com",
            subject: "thread-3",
            to: "to1@example.com",
            isStarred: false,
            isUnread: true,
            body: "Test\nmessage of thread 3",
          },
        ],
      }),
    ]
    let expected = ""
    let actual = ""
    for (let i = 0; i < matchExamples.length; i++) {
      const e = matchExamples[i]
      const threadConfig = newThreadConfig({
        match: e.config,
      })
      const res: string[] = []
      for (const t of threads) {
        if (
          ThreadProcessor.matches(
            mocks.processingContext,
            threadConfig.match,
            t,
          )
        ) {
          res.push(t.getFirstMessageSubject())
        }
      }
      const cfg = JSON.stringify(e.config)
      actual += `${i + 1}. ${cfg}: ${res.sort().join(",")}\n`
      expected += `${i + 1}. ${cfg}: ${e.expected.sort().join(",")}\n`
    }
    expect(actual).toEqual(expected)
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
      {
        orderBy: ThreadOrderField.LAST_MESSAGE_DATE,
        orderDirection: OrderDirection.ASC,
      },
      ThreadProcessor.orderRules,
    )
    expect(threads.map((t) => t.getId())).toEqual(["t2", "t1", "t3"])
  })
  it("should order threads ascending", () => {
    threads = ThreadProcessor.ordered(
      threads,
      {
        orderBy: ThreadOrderField.LAST_MESSAGE_DATE,
        orderDirection: OrderDirection.DESC,
      },
      ThreadProcessor.orderRules,
    )
    expect(threads.map((t) => t.getId())).toEqual(["t3", "t1", "t2"])
  })
})
