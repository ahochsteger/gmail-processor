import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import { ContextMocks } from "../../test/mocks/ContextMocks"
import { EXISTING_FOLDER_NAME } from "../../test/mocks/GDriveMocks"
import { GMailData } from "../../test/mocks/GMailMocks"
import {
  MockFactory,
  Mocks,
  fakedSystemTime,
} from "../../test/mocks/MockFactory"
import { RunMode } from "../Context"
import { Config, newConfig } from "../config/Config"
import { MarkProcessedMethod } from "../config/SettingsConfig"
import { PatternUtil } from "./PatternUtil"

let mocks: Mocks

beforeEach(() => {
  mocks = MockFactory.newMocks(
    ConfigMocks.newDefaultConfig(),
    RunMode.DANGEROUS,
  )
})

describe("Pattern Substitution", () => {
  it("should handle a thread", () => {
    const s1 = PatternUtil.substitute(
      mocks.attachmentContext,
      "${message.from}/${message.to}/${attachment.contentType}/${message.subject}-${message.id}-" +
        "${attachment.index}-${attachment.name}-${message.date:format:yyyy-MM-dd}",
    )
    expect(s1).toBe(
      "message-from@example.com/message-to@example.com/application/pdf/Message Subject 1-message-id-0-attachment1.pdf-2019-05-02",
    )
  })
  it("should handle a thread with a message rule", () => {
    const gmailData: GMailData = {
      threads: [
        {
          messages: [
            {
              subject: "Message 01: Some more text",
              from: "some.email@example.com",
              to: "my.email+emailsuffix@example.com",
              date: new Date("2019-05-01T18:48:31Z"),
              attachments: [
                {
                  name: "attachment123.jpg",
                  contentType: "image/jpeg",
                },
              ],
            },
          ],
        },
      ],
    }
    const pattern =
      "Evaluation data: message.subject: ${message.subject}, message.from: ${message.from}, " +
      "message.to: ${message.to}, message.date: ${message.date:format:yyyy-MM-dd_HH-mm-ss}, " +
      "message.subject.match.1: ${message.subject.match.1}, message.subject.match.2: " +
      "${message.subject.match.2}"
    const expRslt =
      "Evaluation data: message.subject: Message 01: Some more text, " +
      "message.from: some.email@example.com, message.to: my.email+emailsuffix@example.com, " +
      "message.date: 2019-05-01_18-48-31, message.subject.match.1: 01, " +
      "message.subject.match.2: Some more text"
    const config: Config = {
      settings: {
        markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
      },
      threads: [
        {
          messages: [
            {
              match: {
                from: "(.+)@example.com",
                subject: "Message ([0-9]+): (.*)",
                to: "my\\.email\\+(.+)@example.com",
              },
              attachments: [
                {
                  match: { name: "attachment([0-9]+)\\.jpg" },
                  actions: [
                    {
                      name: "attachment.store",
                      args: {
                        location:
                          EXISTING_FOLDER_NAME +
                          "/${message.subject.match.1}/${message.subject} - " +
                          "${attachment.name.match.1}.jpg",
                        conflictStrategy: "replace",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }
    const customMocks = MockFactory.newCustomMocks(config, gmailData)
    const s2 = PatternUtil.substitute(customMocks.attachmentContext, pattern)
    expect(s2).toEqual(expRslt)
  })

  it("should handle a thread with one message", () => {
    const s = PatternUtil.substitute(
      mocks.messageContext,
      "${message.from},${message.to},${message.subject}," +
        "${message.id},${message.date:format:yyyy-MM-dd}",
    )
    expect(s).toBe(
      "message-from@example.com,message-to@example.com,Message Subject 1,message-id,2019-05-02",
    )
  })

  it("should handle a thread with a non-matching message", () => {
    const gmailData: GMailData = {
      threads: [
        {
          messages: [
            {
              subject: "Message 01: Some more text",
              from: "some.email@example.com",
              to: "my.email+emailsuffix@example.com",
              date: new Date("2019-05-01T18:48:31Z"),
              attachments: [
                {
                  name: "attachment123.jpg",
                },
              ],
            },
          ],
        },
      ],
    }
    const config: Config = {
      settings: {
        markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
      },
      threads: [
        {
          messages: [
            {
              match: {
                from: "(.+)@example.com",
                subject: "Message ([0-9]+): (.*)",
                to: "my\\.email\\+(.+)@example.com",
              },
              attachments: [
                {
                  match: { name: "non-matching-attachment([0-9]+)\\.jpg" },
                },
              ],
            },
          ],
        },
      ],
    }
    const customMocks = MockFactory.newCustomMocks(config, gmailData)
    const actual = JSON.parse(
      PatternUtil.substitute(
        customMocks.attachmentContext,
        '{"attachmentMatched":${attachment.matched},"messageMatched":${message.matched}}',
      ),
    )
    expect(actual).toMatchObject({
      attachmentMatched: false,
      messageMatched: true,
    })
  })

  it("should substitute all thread attributes", () => {
    const s = PatternUtil.substitute(
      mocks.messageContext,
      "${thread.firstMessageSubject}," +
        "${thread.hasStarredMessages},${thread.id},${thread.isImportant},${thread.isInPriorityInbox}," +
        "${thread.labels},${thread.lastMessageDate:format:yyyy-MM-dd},${thread.messageCount}," +
        "${thread.permalink}",
    )
    expect(s).toEqual(
      "Message Subject 1,false,threadId123,false,false,,2019-05-02,2,some-permalink-url",
    )
  })

  it("should handle a thread with one message and attachment", () => {
    const s = PatternUtil.substitute(
      mocks.attachmentContext,
      "${message.from}/${message.to}/${attachment.contentType}" +
        "/${message.subject}-${message.id}-${attachment.index}-${attachment.name}-" +
        "${message.date:format:yyyy-MM-dd}",
    )
    expect(s).toBe(
      "message-from@example.com/message-to@example.com/application/pdf/Message Subject 1-message-id-0-attachment1.pdf-2019-05-02",
    )
  })

  it("should substitute advanced message + attachment pattern", () => {
    const s = PatternUtil.substitute(
      mocks.attachmentContext,
      "${message.from}/${message.to}/${attachment.contentType}" +
        "/${message.subject}-${message.id}-${attachment.index}-${attachment.name}-" +
        "${message.date:format:yyyy-MM-dd}",
    )
    expect(s).toBe(
      "message-from@example.com/message-to@example.com/application/pdf/Message Subject 1-message-id-0-attachment1.pdf-2019-05-02",
    )
  })

  it("should substitute mixed message + attachment pattern", () => {
    const s = PatternUtil.substitute(
      mocks.attachmentContext,
      "${message.from}/${message.to}/${attachment.contentType}/" +
        "${message.subject}-${message.id}-${attachment.index}-${attachment.name}-" +
        "${message.date:format:yyyy-MM-dd}",
    )
    expect(s).toBe(
      "message-from@example.com/message-to@example.com/application/pdf/Message Subject 1-message-id-0-attachment1.pdf-2019-05-02",
    )
  })
})
describe("Substitutions", () => {
  it("should substitute all thread attributes", () => {
    expect(
      PatternUtil.substitute(
        mocks.threadContext,
        "${thread.firstMessageSubject},${thread.hasStarredMessages}," +
          "${thread.id},${thread.isImportant},${thread.isInPriorityInbox},${thread.labels}," +
          "${thread.lastMessageDate:format:yyyy-MM-dd HH:mm:ss},${thread.messageCount},${thread.permalink}",
      ),
    ).toBe(
      "Message Subject 1,false,threadId123,false,false,,2019-05-02 07:15:28,2,some-permalink-url",
    )
  })
  it("should substitute all message attributes", () => {
    expect(
      PatternUtil.substitute(
        mocks.messageContext,
        "${message.bcc},${message.cc},${message.date:format:yyyy-MM-dd HH:mm:ss},${message.from}," +
          "${message.id},${message.replyTo},${message.subject},${message.to}",
      ),
    ).toBe(
      "message-bcc@example.com,message-cc@example.com,2019-05-02 07:15:28,message-from@example.com,message-id,message-reply-to@example.com,Message Subject 1,message-to@example.com",
    )
  })
  it("should substitute all attachment attributes", () => {
    expect(
      PatternUtil.substitute(
        mocks.attachmentContext,
        "${attachment.contentType},${attachment.hash},${attachment.isGoogleType},${attachment.name}," +
          "${attachment.size}",
      ),
    ).toEqual(
      "application/pdf,aa0b8cc192a5d8d5b5d8ecda24fd0961b10ae283,false,attachment1.pdf,18",
    )
  })
  it("should substitute with processing context", () => {
    const actual = JSON.parse(
      PatternUtil.substitute(
        mocks.processingContext,
        '{"envRunMode":"${env.runMode}","envTimeZone":"${env.timezone}","dateNow":"${date.now:format:yyyy-MM-dd HH:mm:ss}","timerStartTime":"${timer.startTime:format:yyyy-MM-dd HH:mm:ss}"}',
      ),
    )
    expect(actual).toMatchObject({
      envRunMode: RunMode.DANGEROUS,
      envTimeZone: "UTC",
      dateNow: fakedSystemTime,
      timerStartTime: fakedSystemTime,
    })
  })
  it("should substitute global variables", () => {
    const config = newConfig({
      ...ConfigMocks.newDefaultConfig(),
      global: {
        variables: [
          { key: "custom.var1", value: "value1" },
          { key: "custom.var2", value: "value2" },
        ],
      },
    })
    const ctx = ContextMocks.newProcessingContextMock(
      ContextMocks.newEnvContextMock(),
      config,
    )
    expect(
      PatternUtil.substitute(
        ctx,
        "var1:${variables.custom.var1},var2:${variables.custom.var2},from:${user.email},to:${user.email}",
      ),
    ).toBe(
      "var1:value1,var2:value2,from:my.email@gmail.com,to:my.email@gmail.com",
    )
  })
})
describe("Handle single messages", () => {
  it("should handle a thread with one message and no attachments", () => {
    expect(PatternUtil.substitute(mocks.threadContext, "")).toBe("")
  })
  it("should handle a thread with one message and one attachment", () => {
    expect(
      PatternUtil.substitute(
        mocks.attachmentContext,
        "${thread.firstMessageSubject},${thread.hasStarredMessages},${thread.id},${thread.isImportant}," +
          "${thread.isInPriorityInbox},${thread.labels},${thread.lastMessageDate:format:yyyy-MM-dd " +
          "HH:mm:ss},${thread.messageCount},${thread.permalink}," +
          "${message.bcc},${message.cc},${message.date:format:yyyy-MM-dd HH:mm:ss},${message.from}," +
          "${message.id},${message.replyTo},${message.subject},${message.to}," +
          "${attachment.contentType},${attachment.hash},${attachment.isGoogleType},${attachment.name}," +
          "${attachment.size}",
      ),
    ).toBe(
      "Message Subject 1,false,threadId123,false,false,,2019-05-02 07:15:28,2,some-permalink-url," +
        "message-bcc@example.com,message-cc@example.com,2019-05-02 07:15:28,message-from@example.com," +
        "message-id,message-reply-to@example.com,Message Subject 1,message-to@example.com,application/pdf," +
        "aa0b8cc192a5d8d5b5d8ecda24fd0961b10ae283,false,attachment1.pdf,18",
    )
  })
})
describe("Handle multiple attachments", () => {
  it("should handle a thread with one message and attachment 1 of 2", () => {
    expect(
      PatternUtil.substitute(
        mocks.attachmentContext,
        "${attachment.contentType},${attachment.hash},${attachment.isGoogleType},${attachment.name}," +
          "${attachment.size}",
      ),
    ).toBe(
      "application/pdf,aa0b8cc192a5d8d5b5d8ecda24fd0961b10ae283,false,attachment1.pdf,18",
    )
  })
  it("should handle a thread with one message and attachment 2 of 2", () => {
    expect(
      PatternUtil.substitute(
        mocks.attachmentContext,
        "${attachment.contentType},${attachment.hash},${attachment.isGoogleType},${attachment.name}," +
          "${attachment.size}",
      ),
    ).toBe(
      "application/pdf,aa0b8cc192a5d8d5b5d8ecda24fd0961b10ae283,false,attachment1.pdf,18",
    )
  })
})
describe("Handle multiple messages", () => {
  const pattern =
    "${thread.firstMessageSubject},${thread.hasStarredMessages},${thread.id},${thread.isImportant}," +
    "${thread.isInPriorityInbox},${thread.labels},${thread.lastMessageDate:format:yyyy-MM-dd " +
    "HH:mm:ss},${thread.messageCount},${thread.permalink}," +
    "${message.bcc},${message.cc},${message.date:format:yyyy-MM-dd HH:mm:ss},${message.from}," +
    "${message.id},${message.replyTo},${message.subject},${message.to}," +
    "${attachment.contentType},${attachment.hash},${attachment.isGoogleType},${attachment.name}," +
    "${attachment.size}"
  it("should handle a thread with message 1 of 2 and one attachment", () => {
    expect(PatternUtil.substitute(mocks.attachmentContext, pattern)).toBe(
      "Message Subject 1,false,threadId123,false,false,,2019-05-02 07:15:28,2," +
        "some-permalink-url,message-bcc@example.com,message-cc@example.com," +
        "2019-05-02 07:15:28,message-from@example.com,message-id," +
        "message-reply-to@example.com,Message Subject 1,message-to@example.com," +
        "application/pdf,aa0b8cc192a5d8d5b5d8ecda24fd0961b10ae283,false,attachment1.pdf,18",
    )
  })
  it("should handle a thread with message 2 of 2 and one attachment", () => {
    expect(PatternUtil.substitute(mocks.attachmentContext, pattern)).toBe(
      "Message Subject 1,false,threadId123,false,false,,2019-05-02 07:15:28,2,some-permalink-url,message-bcc@example.com,message-cc@example.com,2019-05-02 07:15:28,message-from@example.com,message-id,message-reply-to@example.com,Message Subject 1,message-to@example.com,application/pdf,aa0b8cc192a5d8d5b5d8ecda24fd0961b10ae283,false,attachment1.pdf,18",
    )
  })
})
describe("Matching", () => {
  test.todo("should handle a thread with matched messages")
  test.todo("should handle a thread with one message and matched attachments")
})
describe("Timezone Handling", () => {
  it("should handle UTC dates and format as UTC", () => {
    expect(
      PatternUtil.formatDate(
        new Date("2022-07-30T16:26:00Z"),
        "yyyy MM dd HH mm ss",
        "UTC",
      ),
    ).toBe("2022 07 30 16 26 00")
  })
  it("should handle UTC dates and format as other timezone", () => {
    expect(
      PatternUtil.formatDate(
        new Date("2022-07-30T16:26:00Z"),
        "yyyy MM dd HH mm ss",
        "Europe/Vienna",
      ),
    ).toBe("2022 07 30 18 26 00")
  })
  it("should handle dates in other timezones and format as UTC", () => {
    expect(
      PatternUtil.formatDate(
        new Date("2022-07-30T18:26:00+02:00"),
        "yyyy MM dd HH mm ss",
        "UTC",
      ),
    ).toBe("2022 07 30 16 26 00")
  })
  it("should handle dates in other timezones and format as the same other timezone", () => {
    expect(
      PatternUtil.formatDate(
        new Date("2022-07-30T18:26:00+02:00"),
        "yyyy MM dd HH mm ss",
        "Europe/Vienna",
      ),
    ).toBe("2022 07 30 18 26 00")
  })
  it("should handle dates in other timezones and format as yet another timezone", () => {
    expect(
      PatternUtil.formatDate(
        new Date("2022-07-30T18:26:00+02:00"),
        "yyyy MM dd HH mm ss",
        "America/New_York",
      ),
    ).toBe("2022 07 30 12 26 00")
  })
})
describe("Placeholder Handling", () => {
  it("should find multiple occurance of placeholder", () => {
    const s =
      "${message.bcc},${message.cc},${date.now:format:yyyy-MM-dd HH:mm:ss},${message.from}," +
      "${message.id},${message.replyTo},${message.subject},${message.to},${date.now:format:yyyy-MM-dd HH:mm:ss}"
    const actual = PatternUtil.substitute(mocks.attachmentContext, s)
    expect(actual).toEqual(
      `message-bcc@example.com,message-cc@example.com,${fakedSystemTime},message-from@example.com,message-id,message-reply-to@example.com,Message Subject 1,message-to@example.com,${fakedSystemTime}`,
    )
  })
})
