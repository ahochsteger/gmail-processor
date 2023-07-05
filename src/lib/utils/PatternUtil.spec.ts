import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import { ContextMocks } from "../../test/mocks/ContextMocks"
import { GMailData, GMailMocks, ThreadData } from "../../test/mocks/GMailMocks"
import {
  MockFactory,
  Mocks,
  fakedSystemTime,
} from "../../test/mocks/MockFactory"
import { RunMode } from "../Context"
import { Config, newConfig } from "../config/Config"
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
      ContextMocks.newAttachmentContextMock(),
      "${message.from}/${message.to}/${attachment.contentType}/${message.subject}-${message.id}-" +
        "${attachment.index}-${attachment.name}-${message.date:format:YYYY-MM-DD}",
    )
    expect(s1).toBe(
      "message-from@example.com/message-to@example.com/text/plain/Message Subject-message-id-0-attachment.txt-2019-05-02",
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
      "message.to: ${message.to}, message.date: ${message.date:format:YYYY-MM-DD_HH-mm-ss}, " +
      "message.subject.match.1: ${message.subject.match.1}, message.subject.match.2: " +
      "${message.subject.match.2}"
    const expRslt =
      "Evaluation data: message.subject: Message 01: Some more text, " +
      "message.from: some.email@example.com, message.to: my.email+emailsuffix@example.com, " +
      "message.date: 2019-05-01_18-48-31, message.subject.match.1: 01, " +
      "message.subject.match.2: Some more text"
    const config: Config = {
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
                          "Folder2/Subfolder2/${message.subject.match.1}/${message.subject} - " +
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
  const sharedThreadData = {
    messages: [
      {
        date: new Date("2018-05-27T12:34:56Z"),
        from: "msgFrom",
        id: "msgId",
        subject: "msgSubject",
        to: "msgTo",
        attachments: [
          {
            contentType: "attContentType1",
            name: "attName1",
          },
          {
            contentType: "attContentType2",
            name: "attName2",
          },
        ],
      },
    ],
  }

  it("should handle a thread with one message", () => {
    const s = PatternUtil.substitute(
      ContextMocks.newMessageContextMock(),
      "${message.from},${message.to},${message.subject}," +
        "${message.id},${message.date:format:YYYY-MM-DD}",
    )
    expect(s).toBe(
      "message-from@example.com,message-to@example.com,Message Subject,message-id,2019-05-02",
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
      ContextMocks.newMessageContextMockFromThreadData(),
      "${thread.firstMessageSubject}," +
        "${thread.hasStarredMessages},${thread.id},${thread.isImportant},${thread.isInPriorityInbox}," +
        "${thread.labels},${thread.lastMessageDate:format:YYYY-MM-DD},${thread.messageCount}," +
        "${thread.permalink}",
    )
    expect(s).toEqual(
      "Message Subject 1,false,threadId123,false,false,,2019-05-02,2,some-permalink-url",
    )
  })

  it("should handle a thread with one message and attachment 1 of 2", () => {
    const ctx = ContextMocks.newAttachmentContextMockFromThreadData(
      sharedThreadData,
      0,
      0,
    )
    const s = PatternUtil.substitute(
      ctx,
      "${message.from}/${message.to}/${attachment.contentType}" +
        "/${message.subject}-${message.id}-${attachment.index}-${attachment.name}-" +
        "${message.date:format:YYYY-MM-DD}",
    )
    expect(s).toBe(
      "msgFrom/msgTo/attContentType1/msgSubject-msgId-0-attName1-2018-05-27",
    )
  })

  it("should substitute advanced message + attachment pattern", () => {
    const ctx = ContextMocks.newAttachmentContextMockFromThreadData(
      sharedThreadData,
      0,
      1,
    )
    const s = PatternUtil.substitute(
      ctx,
      "${message.from}/${message.to}/${attachment.contentType}" +
        "/${message.subject}-${message.id}-${attachment.index}-${attachment.name}-" +
        "${message.date:format:YYYY-MM-DD}",
    )
    expect(s).toBe(
      "msgFrom/msgTo/attContentType2/msgSubject-msgId-1-attName2-2018-05-27",
    )
  })

  it("should substitute mixed message + attachment pattern", () => {
    const s = PatternUtil.substitute(
      ContextMocks.newAttachmentContextMock(),
      "${message.from}/${message.to}/${attachment.contentType}/" +
        "${message.subject}-${message.id}-${attachment.index}-${attachment.name}-" +
        "${message.date:format:YYYY-MM-DD}",
    )
    expect(s).toBe(
      "message-from@example.com/message-to@example.com/text/plain/Message Subject-message-id-0-attachment.txt-2019-05-02",
    )
  })
})
describe("Substitutions", () => {
  it("should substitute all thread attributes", () => {
    expect(
      PatternUtil.substitute(
        ContextMocks.newThreadContextMock(),
        "${thread.firstMessageSubject},${thread.hasStarredMessages}," +
          "${thread.id},${thread.isImportant},${thread.isInPriorityInbox},${thread.labels}," +
          "${thread.lastMessageDate:format:YYYY-MM-DD HH:mm:ss},${thread.messageCount},${thread.permalink}",
      ),
    ).toBe(
      "Message Subject 1,false,threadId123,false,false,,2019-05-02 07:15:28,2,some-permalink-url",
    )
  })
  it("should substitute all message attributes", () => {
    expect(
      PatternUtil.substitute(
        ContextMocks.newMessageContextMock(),
        "${message.bcc},${message.cc},${message.date:format:YYYY-MM-DD HH:mm:ss},${message.from}," +
          "${message.id},${message.replyTo},${message.subject},${message.to}",
      ),
    ).toBe(
      "message-bcc@example.com,message-cc@example.com,2019-05-02 07:15:28,message-from@example.com,message-id,message-reply-to@example.com,Message Subject,message-to@example.com",
    )
  })
  it("should substitute all attachment attributes", () => {
    const threadData = {
      messages: [
        {
          attachments: [
            {
              contentType: "act",
              isGoogleType: true,
              name: "aname",
            },
          ],
        },
      ],
    }
    const ctx = ContextMocks.newAttachmentContextMockFromThreadData(threadData)
    expect(
      PatternUtil.substitute(
        ctx,
        "${attachment.contentType},${attachment.hash},${attachment.isGoogleType},${attachment.name}," +
          "${attachment.size}",
      ),
    ).toEqual("act,a53be3c62f10eb7174efaab688b655a066a7f9f5,true,aname,19")
  })
  it("should substitute with processing context", () => {
    const actual = JSON.parse(
      PatternUtil.substitute(
        mocks.processingContext,
        '{"envRunMode":"${env.runMode}","envTimeZone":"${env.timezone}","dateNow":"${date.now:format:YYYY-MM-DD HH:mm:ss}","timerStartTime":"${timer.startTime:format:YYYY-MM-DD HH:mm:ss}"}',
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
        ContextMocks.newAttachmentContextMock(),
        "${thread.firstMessageSubject},${thread.hasStarredMessages},${thread.id},${thread.isImportant}," +
          "${thread.isInPriorityInbox},${thread.labels},${thread.lastMessageDate:format:YYYY-MM-DD " +
          "HH:mm:ss},${thread.messageCount},${thread.permalink}," +
          "${message.bcc},${message.cc},${message.date:format:YYYY-MM-DD HH:mm:ss},${message.from}," +
          "${message.id},${message.replyTo},${message.subject},${message.to}," +
          "${attachment.contentType},${attachment.hash},${attachment.isGoogleType},${attachment.name}," +
          "${attachment.size}",
      ),
    ).toBe(
      "Message Subject 1,false,threadId123,false,false,,2019-05-02 07:15:28,2,some-permalink-url," +
        "message-bcc@example.com,message-cc@example.com,2019-05-02 07:15:28,message-from@example.com," +
        "message-id,message-reply-to@example.com,Message Subject,message-to@example.com,text/plain," +
        "a53be3c62f10eb7174efaab688b655a066a7f9f5,false,attachment.txt,19",
    )
  })
})
describe("Handle multiple attachments", () => {
  const threadData: ThreadData = {
    messages: [
      {
        attachments: [
          {
            contentType: "text/plain",
            isGoogleType: true,
            name: "attachment-1.txt",
          },
          {
            contentType: "image/png",
            isGoogleType: false,
            name: "attachment-2.png",
          },
        ],
      },
    ],
  }
  it("should handle a thread with one message and attachment 1 of 2", () => {
    expect(
      PatternUtil.substitute(
        ContextMocks.newAttachmentContextMockFromThreadData(threadData, 0, 0),
        "${attachment.contentType},${attachment.hash},${attachment.isGoogleType},${attachment.name}," +
          "${attachment.size}",
      ),
    ).toBe(
      "text/plain,a53be3c62f10eb7174efaab688b655a066a7f9f5,true,attachment-1.txt,19",
    )
  })
  it("should handle a thread with one message and attachment 2 of 2", () => {
    const ctx = ContextMocks.newAttachmentContextMockFromThreadData(
      threadData,
      0,
      1,
    )
    expect(
      PatternUtil.substitute(
        ctx,
        "${attachment.contentType},${attachment.hash},${attachment.isGoogleType},${attachment.name}," +
          "${attachment.size}",
      ),
    ).toBe(
      "image/png,a53be3c62f10eb7174efaab688b655a066a7f9f5,false,attachment-2.png,19",
    )
  })
})
describe("Handle multiple messages", () => {
  const threadData = {
    hasStarredMessages: true,
    id: "tid",
    isImportant: true,
    isInPriorityInbox: true,
    labels: ["l1", "l2"],
    permalink: "tpl",
    messages: [
      {
        bcc: "mbcc1",
        cc: "mcc1",
        date: new Date("2019-05-06T01:23:45Z"),
        from: "mfrom1",
        id: "mid1",
        replyTo: "mrt1",
        subject: "msj1",
        to: "mto1",
        attachments: [
          {
            contentType: "act1",
            hash: "ah1",
            isGoogleType: true,
            name: "aname1",
            size: 12345,
          },
        ],
      },
      {
        bcc: "mbcc2",
        cc: "mcc2",
        date: new Date("2019-05-06T12:34:56Z"),
        from: "mfrom2",
        id: "mid2",
        replyTo: "mrt2",
        subject: "msj2",
        to: "mto2",
        attachments: [
          {
            contentType: "act2",
            isGoogleType: false,
            name: "aname2",
          },
        ],
      },
    ],
  }
  const pattern =
    "${thread.firstMessageSubject},${thread.hasStarredMessages},${thread.id},${thread.isImportant}," +
    "${thread.isInPriorityInbox},${thread.labels},${thread.lastMessageDate:format:YYYY-MM-DD " +
    "HH:mm:ss},${thread.messageCount},${thread.permalink}," +
    "${message.bcc},${message.cc},${message.date:format:YYYY-MM-DD HH:mm:ss},${message.from}," +
    "${message.id},${message.replyTo},${message.subject},${message.to}," +
    "${attachment.contentType},${attachment.hash},${attachment.isGoogleType},${attachment.name}," +
    "${attachment.size}"
  it("should handle a thread with message 1 of 2 and one attachment", () => {
    const thread = GMailMocks.getThreadSampleData(threadData)
    const message = thread.messages[0]
    const attachment = message.attachments[0]
    const ctx = ContextMocks.newAttachmentContextMockFromThreadData(
      threadData,
      0,
    )
    expect(PatternUtil.substitute(ctx, pattern)).toBe(
      `${thread.firstMessageSubject},${thread.hasStarredMessages},${
        thread.id
      },${thread.isImportant},${thread.isInPriorityInbox},${thread.labels.join(
        ",",
      )},${thread.lastMessageDate
        .toISOString()
        .replace(/T([0-9]{2}:[0-9]{2}:[0-9]{2}).*/, " $1")},${
        thread.messages.length
      },${thread.permalink},${message.bcc},${message.cc},${message.date
        .toISOString()
        .replace(/T([0-9]{2}:[0-9]{2}:[0-9]{2}).*/, " $1")},${message.from},${
        message.id
      },${message.replyTo},${message.subject},${message.to},${
        attachment.contentType
      },${attachment.hash},${attachment.isGoogleType},${attachment.name},${
        attachment.size
      }`,
      // "msj1,true,tid,true,true,l1,l2,2019-05-06 12:34:56,2,tpl," +
      //   "message-bcc@example.com,message-cc@example.com,2019-05-02 07:15:28,message-from@example.com," +
      //   "message-id,message-reply-to@example.com,Message Subject,message-to@example.com,text/plain," +
      //   "a53be3c62f10eb7174efaab688b655a066a7f9f5,false,attachment.txt,19",
    )
  })
  it("should handle a thread with message 2 of 2 and one attachment", () => {
    const thread = GMailMocks.getThreadSampleData(threadData)
    const message = thread.messages[1]
    const attachment = message.attachments[0]
    const ctx = ContextMocks.newAttachmentContextMockFromThreadData(
      threadData,
      1,
      0,
    )
    expect(PatternUtil.substitute(ctx, pattern)).toBe(
      `${thread.firstMessageSubject},${thread.hasStarredMessages},${
        thread.id
      },${thread.isImportant},${thread.isInPriorityInbox},${thread.labels.join(
        ",",
      )},${thread.lastMessageDate
        .toISOString()
        .replace(/T([0-9]{2}:[0-9]{2}:[0-9]{2}).*/, " $1")},${
        thread.messages.length
      },${thread.permalink},${message.bcc},${message.cc},${message.date
        .toISOString()
        .replace(/T([0-9]{2}:[0-9]{2}:[0-9]{2}).*/, " $1")},${message.from},${
        message.id
      },${message.replyTo},${message.subject},${message.to},${
        attachment.contentType
      },${attachment.hash},${attachment.isGoogleType},${attachment.name},${
        attachment.size
      }`,
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
        "YYYY MM DD HH mm ss",
        "UTC",
      ),
    ).toBe("2022 07 30 16 26 00")
  })
  it("should handle UTC dates and format as other timezone", () => {
    expect(
      PatternUtil.formatDate(
        new Date("2022-07-30T16:26:00Z"),
        "YYYY MM DD HH mm ss",
        "Europe/Vienna",
      ),
    ).toBe("2022 07 30 18 26 00")
  })
  it("should handle dates in other timezones and format as UTC", () => {
    expect(
      PatternUtil.formatDate(
        new Date("2022-07-30T18:26:00+02:00"),
        "YYYY MM DD HH mm ss",
        "UTC",
      ),
    ).toBe("2022 07 30 16 26 00")
  })
  it("should handle dates in other timezones and format as the same other timezone", () => {
    expect(
      PatternUtil.formatDate(
        new Date("2022-07-30T18:26:00+02:00"),
        "YYYY MM DD HH mm ss",
        "Europe/Vienna",
      ),
    ).toBe("2022 07 30 18 26 00")
  })
  it("should handle dates in other timezones and format as yet another timezone", () => {
    expect(
      PatternUtil.formatDate(
        new Date("2022-07-30T18:26:00+02:00"),
        "YYYY MM DD HH mm ss",
        "America/New_York",
      ),
    ).toBe("2022 07 30 12 26 00")
  })
})
describe("Placeholder Handling", () => {
  it("should find multiple occurance of placeholder", () => {
    const s =
      "${message.bcc},${message.cc},${date.now:format:YYYY-MM-DD HH:mm:ss},${message.from}," +
      "${message.id},${message.replyTo},${message.subject},${message.to},${date.now:format:YYYY-MM-DD HH:mm:ss}"
    const actual = PatternUtil.substitute(mocks.attachmentContext, s)
    expect(actual).toEqual(
      `message-bcc@example.com,message-cc@example.com,${fakedSystemTime},message-from@example.com,message-id,message-reply-to@example.com,Message Subject 1,message-to@example.com,${fakedSystemTime}`,
    )
  })
})
