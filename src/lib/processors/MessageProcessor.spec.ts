import { GMailMocks } from "../../test/mocks/GMailMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { OrderDirection } from "../config/CommonConfig"
import { MessageOrderField, newMessageConfig } from "../config/MessageConfig"
import { MessageFlag } from "../config/MessageFlag"
import { MessageMatchConfig } from "../config/MessageMatchConfig"
import { MessageProcessor } from "./MessageProcessor"

let mocks: Mocks

beforeEach(() => {
  mocks = MockFactory.newMocks()
})

describe("match()", () => {
  it("should match messages with matching parameters", () => {
    const matchExamples: { config: MessageMatchConfig; expected: string[] }[] =
      [
        // {
        //   config: {
        //     from: "from[0-1]@example.com",
        //   },
        //   expected: ["message-1"],
        // },
        // {
        //   config: {
        //     from: "from[2-9]@example.com",
        //   },
        //   expected: ["message-2"],
        // },
        // {
        //   config: {
        //     to: "to.*@example.com",
        //   },
        //   expected: ["message-1", "message-2"],
        // },
        // {
        //   config: {
        //     to: "not-to.*@example.com",
        //   },
        //   expected: [],
        // },
        // {
        //   config: {
        //     subject: "message-.*",
        //   },
        //   expected: ["message-1", "message-2"],
        // },
        // {
        //   config: {
        //     subject: "message-2",
        //   },
        //   expected: ["message-2"],
        // },
        {
          config: {
            is: [MessageFlag.UNREAD],
          },
          expected: ["message-1"],
        },
        {
          config: {
            is: [MessageFlag.READ],
          },
          expected: ["message-2"],
        },
        {
          config: {
            is: [MessageFlag.UNSTARRED],
          },
          expected: ["message-1"],
        },
        {
          config: {
            is: [MessageFlag.STARRED],
          },
          expected: ["message-2"],
        },
        {
          config: {
            body: "Test.+message 1",
          },
          expected: [],
        },
        {
          config: {
            body: "(?s)Test.+message 1",
          },
          expected: ["message-1"],
        },
      ]
    const mockedThread = GMailMocks.newThreadMock({
      messages: [
        {
          from: "from1@example.com",
          subject: "message-1",
          to: "to1@example.com",
          isStarred: false,
          isUnread: true,
          body: "Test\nmessage 1",
        },
        {
          from: "from2@example.com",
          subject: "message-2",
          to: "to2@example.com",
          isStarred: true,
          isUnread: false,
          body: "Test\nmessage 2",
        },
      ],
    })
    let expected = ""
    let actual = ""
    for (let i = 0; i < matchExamples.length; i++) {
      const e = matchExamples[i]
      const messageConfig = newMessageConfig({
        match: e.config,
      })
      const res = []
      for (const m of mockedThread.getMessages()) {
        if (
          MessageProcessor.matches(mocks.threadContext, messageConfig.match, m)
        ) {
          res.push(m.getSubject())
        }
      }
      const cfg = JSON.stringify(e.config)
      actual += `${i + 1}. ${cfg}: ${res}\n`
      expected += `${i + 1}. ${cfg}: ${e.expected}\n`
    }
    expect(actual).toEqual(expected)
  })
})

describe("processEntity()", () => {
  it("should process a message config", () => {
    const ctx = mocks.messageContext
    MessageProcessor.processEntity(ctx)
  })
})

describe("order messages", () => {
  let messages = [
    GMailMocks.newMessageMock({
      id: "m1",
      date: new Date(2024, 5, 10),
    }),
    GMailMocks.newMessageMock({
      id: "m2",
      date: new Date(2024, 5, 9),
    }),
    GMailMocks.newMessageMock({
      id: "m3",
      date: new Date(2024, 5, 11),
    }),
  ]
  it("should order threads ascending", () => {
    messages = MessageProcessor.ordered(
      messages,
      { orderBy: MessageOrderField.DATE, orderDirection: OrderDirection.ASC },
      MessageProcessor.orderRules,
    )
    expect(messages.map((t) => t.getId())).toEqual(["m2", "m1", "m3"])
  })
  it("should order threads ascending", () => {
    messages = MessageProcessor.ordered(
      messages,
      { orderBy: MessageOrderField.DATE, orderDirection: OrderDirection.DESC },
      MessageProcessor.orderRules,
    )
    expect(messages.map((t) => t.getId())).toEqual(["m3", "m1", "m2"])
  })
})
