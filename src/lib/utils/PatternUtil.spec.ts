import { ContextMocks } from "../../test/mocks/ContextMocks"
import { GMailMocks } from "../../test/mocks/GMailMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { RunMode } from "../Context"
import { newConfig } from "../config/Config"
import { newMessageConfig } from "../config/MessageConfig"
import { newThreadConfig } from "../config/ThreadConfig"
import { PatternUtil } from "./PatternUtil"

let mocks: Mocks

beforeEach(() => {
  mocks = MockFactory.newMocks(newConfig(), RunMode.DANGEROUS)
})

describe("Pattern Substitution", () => {
  it("should handle a thread", () => {
    const s1 = PatternUtil.substitute(
      ContextMocks.newAttachmentContextMock(),
      "${message.from}/${message.to}/${attachment.contentType}/${message.subject}-${message.id}-" +
        "${attachment.index}-${attachment.name}-${message.date:dateformat:YYYY-MM-DD}",
    )
    expect(s1).toBe(
      "message-from@example.com/message-to@example.com/text/plain/message subject-message-id-0-attachment.txt-2019-05-02",
    )
  })
  it("should handle a thread with a message rule", () => {
    const thread2 = GMailMocks.newThreadMock({
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
    })
    const pattern =
      "Evaluation data: message.subject: ${message.subject}, message.from: ${message.from}, " +
      "message.to: ${message.to}, message.date: ${message.date:dateformat:YYYY-MM-DD_HH-mm-ss}, " +
      "message.subject.match.1: ${message.subject.match.1}, message.subject.match.2: " +
      "${message.subject.match.2}"
    const expRslt =
      "Evaluation data: message.subject: Message 01: Some more text, " +
      "message.from: some.email@example.com, message.to: my.email+emailsuffix@example.com, " +
      "message.date: 2019-05-01_18-48-31, message.subject.match.1: 01, " +
      "message.subject.match.2: Some more text"
    const messageConfig = newMessageConfig({
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
    })
    const attachmentContext = ContextMocks.newAttachmentContextMock()
    attachmentContext.thread.object = thread2
    attachmentContext.message.object = thread2.getMessages()[0]
    attachmentContext.message.config = messageConfig
    const s2 = PatternUtil.substitute(attachmentContext, pattern)
    expect(s2).toBe(expRslt)
  })
  const sharedThread = GMailMocks.newThreadMock({
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
  })

  it("should handle a thread with one message", () => {
    const s = PatternUtil.substitute(
      ContextMocks.newMessageContextMock(),
      "${message.from},${message.to},${message.subject}," +
        "${message.id},${message.date:dateformat:YYYY-MM-DD}",
    )
    expect(s).toBe(
      "message-from@example.com,message-to@example.com,message subject,message-id,2019-05-02",
    )
  })

  it("should handle a thread with a non-matching message", () => {
    const thread = GMailMocks.newThreadMock({
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
    })
    const threadConfig = newThreadConfig({
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
    })
    const attachmentContext = ContextMocks.newAttachmentContextMock()
    attachmentContext.thread.config = threadConfig
    attachmentContext.thread.object = thread
    attachmentContext.message.object = thread.getMessages()[0]
    attachmentContext.message.config = threadConfig.messages[0]
    attachmentContext.attachment.config =
      threadConfig.messages[0].attachments[0]
    attachmentContext.attachment.object = thread
      .getMessages()[0]
      .getAttachments()[0]
    const actual = JSON.parse(
      PatternUtil.substitute(
        attachmentContext,
        '{"attachmentMatched":${attachment.matched},"messageMatched":${message.matched}}',
      ),
    )
    expect(actual.messageMatched).toEqual(true)
    expect(actual.attachmentMatched).toEqual(false)
  })

  it("should substitute all thread attributes", () => {
    const s = PatternUtil.substitute(
      ContextMocks.newMessageContextMock(),
      "${thread.firstMessageSubject}," +
        "${thread.hasStarredMessages},${thread.id},${thread.isImportant},${thread.isInPriorityInbox}," +
        "${thread.labels},${thread.lastMessageDate:dateformat:YYYY-MM-DD},${thread.messageCount}," +
        "${thread.permalink}",
    )
    expect(s).toBe(
      "message subject,false,threadId123,false,false,,2019-05-02,2,some-permalink-url",
    )
  })

  it("should handle a thread with one message and attachment 1 of 2", () => {
    const ctx = ContextMocks.newAttachmentContextMock()
    const msg = sharedThread.getMessages()[0]
    ctx.thread.object = sharedThread
    ctx.message.object = msg
    ctx.attachment.object = msg.getAttachments()[0]
    const s = PatternUtil.substitute(
      ctx,
      "${message.from}/${message.to}/${attachment.contentType}" +
        "/${message.subject}-${message.id}-${attachment.index}-${attachment.name}-" +
        "${message.date:dateformat:YYYY-MM-DD}",
    )
    expect(s).toBe(
      "msgFrom/msgTo/attContentType1/msgSubject-msgId-0-attName1-2018-05-27",
    )
  })

  it("should substitute advanced message + attachment pattern", () => {
    const ctx = ContextMocks.newAttachmentContextMock()
    const msg = sharedThread.getMessages()[0]
    ctx.thread.object = sharedThread
    ctx.message.object = msg
    ctx.attachment.object = msg.getAttachments()[1]
    ctx.attachment.index = 1
    const s = PatternUtil.substitute(
      ctx,
      "${message.from}/${message.to}/${attachment.contentType}" +
        "/${message.subject}-${message.id}-${attachment.index}-${attachment.name}-" +
        "${message.date:dateformat:YYYY-MM-DD}",
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
        "${message.date:dateformat:YYYY-MM-DD}",
    )
    expect(s).toBe(
      "message-from@example.com/message-to@example.com/text/plain/message subject-message-id-0-attachment.txt-2019-05-02",
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
          "${thread.lastMessageDate:dateformat:YYYY-MM-DD HH:mm:ss},${thread.messageCount},${thread.permalink}",
      ),
    ).toBe(
      "message subject,false,threadId123,false,false,,2019-05-02 07:15:28,2,some-permalink-url",
    )
  })
  it("should substitute all message attributes", () => {
    expect(
      PatternUtil.substitute(
        ContextMocks.newMessageContextMock(),
        "${message.bcc},${message.cc},${message.date:dateformat:YYYY-MM-DD HH:mm:ss},${message.from}," +
          "${message.id},${message.replyTo},${message.subject},${message.to}",
      ),
    ).toBe(
      "message-bcc@example.com,message-cc@example.com,2019-05-02 07:15:28,message-from@example.com,message-id,message-reply-to@example.com,message subject,message-to@example.com",
    )
  })
  it("should substitute all attachment attributes", () => {
    const thread = GMailMocks.newThreadMock({
      messages: [
        {
          attachments: [
            {
              contentType: "act",
              hash: "ah",
              isGoogleType: true,
              name: "aname",
              size: 12345,
            },
          ],
        },
      ],
    })
    const ctx = ContextMocks.newAttachmentContextMock()
    const msg = thread.getMessages()[0]
    ctx.thread.object = thread
    ctx.message.object = msg
    ctx.attachment.object = msg.getAttachments()[0]
    ctx.attachment.index = 1

    expect(
      PatternUtil.substitute(
        ctx,
        "${attachment.contentType},${attachment.hash},${attachment.isGoogleType},${attachment.name}," +
          "${attachment.size}",
      ),
    ).toBe("act,ah,true,aname,12345")
  })
  it("should substitute with processing context", () => {
    const fakedSystemTime = "2023-05-30 08:31:14"
    jest.useFakeTimers({ now: new Date(fakedSystemTime + "Z") })
    mocks.processingContext.proc.timer.start()
    const actual = JSON.parse(
      PatternUtil.substitute(
        mocks.processingContext,
        '{"envRunMode":"${env.runMode}","envTimeZone":"${env.timezone}","timerNow":"${date.now:dateformat:YYYY-MM-DD HH:mm:ss}","timerRunTime":${timer.runTime},"timerStartTime":"${timer.startTime:dateformat:YYYY-MM-DD HH:mm:ss}"}',
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any
    expect(actual.envRunMode).toEqual("dangerous")
    expect(actual.envTimeZone).toEqual("UTC")
    expect(actual.timerNow).toEqual(fakedSystemTime)
    expect(actual.timerRunTime).toEqual(0.0)
    expect(actual.timerStartTime).toEqual(fakedSystemTime)
    jest.useRealTimers()
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
    mocks.processingContext.proc.config = config
    expect(
      PatternUtil.substitute(
        mocks.processingContext,
        "var1:${variables.custom.var1},var2:${variables.custom.var2},email:${user.email}",
      ),
    ).toBe("var1:value1,var2:value2,email:my.email@gmail.com")
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
          "${thread.isInPriorityInbox},${thread.labels},${thread.lastMessageDate:dateformat:YYYY-MM-DD " +
          "HH:mm:ss},${thread.messageCount},${thread.permalink}," +
          "${message.bcc},${message.cc},${message.date:dateformat:YYYY-MM-DD HH:mm:ss},${message.from}," +
          "${message.id},${message.replyTo},${message.subject},${message.to}," +
          "${attachment.contentType},${attachment.hash},${attachment.isGoogleType},${attachment.name}," +
          "${attachment.size}",
      ),
    ).toBe(
      "message subject,false,threadId123,false,false,,2019-05-02 07:15:28,2,some-permalink-url," +
        "message-bcc@example.com,message-cc@example.com,2019-05-02 07:15:28,message-from@example.com," +
        "message-id,message-reply-to@example.com,message subject,message-to@example.com,text/plain," +
        "a53be3c62f10eb7174efaab688b655a066a7f9f5,false,attachment.txt,19",
    )
  })
})
describe("Handle multiple attachments", () => {
  const thread = GMailMocks.newThreadMock({
    messages: [
      {
        attachments: [
          {
            contentType: "act1",
            hash: "ah1",
            isGoogleType: true,
            name: "aname1",
            size: 12345,
          },
          {
            contentType: "act2",
            hash: "ah2",
            isGoogleType: false,
            name: "aname2",
            size: 23456,
          },
        ],
      },
    ],
  })
  it("should handle a thread with one message and attachment 1 of 2", () => {
    expect(
      PatternUtil.substitute(
        ContextMocks.newAttachmentContextMock(),
        "${attachment.contentType},${attachment.hash},${attachment.isGoogleType},${attachment.name}," +
          "${attachment.size}",
      ),
    ).toBe(
      "text/plain,a53be3c62f10eb7174efaab688b655a066a7f9f5,false,attachment.txt,19",
    )
  })
  it("should handle a thread with one message and attachment 2 of 2", () => {
    const ctx = ContextMocks.newAttachmentContextMock()
    const msg = thread.getMessages()[0]
    ctx.thread.object = thread
    ctx.message.object = msg
    ctx.attachment.object = msg.getAttachments()[1]
    ctx.attachment.index = 1
    expect(
      PatternUtil.substitute(
        ctx,
        "${attachment.contentType},${attachment.hash},${attachment.isGoogleType},${attachment.name}," +
          "${attachment.size}",
      ),
    ).toBe("act2,ah2,false,aname2,23456")
  })
})
describe("Handle multiple messages", () => {
  const thread = GMailMocks.newThreadMock({
    firstMessageSubject: "tfms",
    hasStarredMessages: true,
    id: "tid",
    isImportant: true,
    isInPriorityInbox: true,
    labels: ["l1", "l2"],
    lastMessageDate: new Date("2019-05-06T12:34:56Z"),
    messageCount: 3,
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
            hash: "ah2",
            isGoogleType: false,
            name: "aname2",
            size: 23456,
          },
        ],
      },
    ],
  })
  it("should handle a thread with message 1 of 2 and one attachment", () => {
    expect(
      PatternUtil.substitute(
        ContextMocks.newAttachmentContextMock(),
        "${thread.firstMessageSubject},${thread.hasStarredMessages},${thread.id},${thread.isImportant}," +
          "${thread.isInPriorityInbox},${thread.labels},${thread.lastMessageDate:dateformat:YYYY-MM-DD " +
          "HH:mm:ss},${thread.messageCount},${thread.permalink}," +
          "${message.bcc},${message.cc},${message.date:dateformat:YYYY-MM-DD HH:mm:ss},${message.from}," +
          "${message.id},${message.replyTo},${message.subject},${message.to}," +
          "${attachment.contentType},${attachment.hash},${attachment.isGoogleType},${attachment.name}," +
          "${attachment.size}",
      ),
    ).toBe(
      "message subject,false,threadId123,false,false,,2019-05-02 07:15:28,2,some-permalink-url," +
        "message-bcc@example.com,message-cc@example.com,2019-05-02 07:15:28,message-from@example.com," +
        "message-id,message-reply-to@example.com,message subject,message-to@example.com,text/plain," +
        "a53be3c62f10eb7174efaab688b655a066a7f9f5,false,attachment.txt,19",
    )
  })
  it("should handle a thread with message 2 of 2 and one attachment", () => {
    const ctx = ContextMocks.newAttachmentContextMock()
    const msg = thread.getMessages()[1]
    ctx.thread.object = thread
    ctx.message.object = msg
    ctx.attachment.object = msg.getAttachments()[0]
    ctx.attachment.index = 1
    expect(
      PatternUtil.substitute(
        ctx,
        "${thread.firstMessageSubject},${thread.hasStarredMessages},${thread.id},${thread.isImportant}," +
          "${thread.isInPriorityInbox},${thread.labels},${thread.lastMessageDate:dateformat:YYYY-MM-DD " +
          "HH:mm:ss},${thread.messageCount},${thread.permalink}," +
          "${message.bcc},${message.cc},${message.date:dateformat:YYYY-MM-DD HH:mm:ss},${message.from}," +
          "${message.id},${message.replyTo},${message.subject},${message.to}," +
          "${attachment.contentType},${attachment.hash},${attachment.isGoogleType},${attachment.name}," +
          "${attachment.size}",
      ),
    ).toBe(
      "tfms,true,tid,true,true,l1,l2,2019-05-06 12:34:56,3,tpl," +
        "mbcc2,mcc2,2019-05-06 12:34:56,mfrom2,mid2,mrt2,msj2,mto2," +
        "act2,ah2,false,aname2,23456",
    )
  })
})
describe("Matching", () => {
  test.todo("should handle a thread with matched messages")
  test.todo("should handle a thread with one message and matched attachments")
})
describe("Compatibility", () => {
  it("should support old date format", () => {
    expect(PatternUtil.convertDateFormat("yyyy-MM-dd HH-mm-ss")).toBe(
      "YYYY-MM-DD HH-mm-ss",
    )
  })
  it("should support old filename pattern (type: 'string'format'string')", () => {
    expect(
      PatternUtil.convertFromV1Pattern(
        "'file-'yyyy-MM-dd-'%s.txt'",
        "message.date",
      ),
    ).toBe("file-${message.date:dateformat:YYYY-MM-DD-}${message.subject}.txt")
  })
  it("should support old filename pattern (type: 'string'format)", () => {
    expect(
      PatternUtil.convertFromV1Pattern("'file-'yyyy-MM-dd", "message.date"),
    ).toBe("file-${message.date:dateformat:YYYY-MM-DD}")
  })
  it("should support old filename pattern (type: format'string')", () => {
    expect(
      PatternUtil.convertFromV1Pattern("yyyy-MM-dd'-%s.txt'", "message.date"),
    ).toBe("${message.date:dateformat:YYYY-MM-DD}-${message.subject}.txt")
  })
  it("should support old filename pattern (type: format)", () => {
    expect(PatternUtil.convertFromV1Pattern("yyyy-MM-dd", "message.date")).toBe(
      "${message.date:dateformat:YYYY-MM-DD}",
    )
  })
  it("should support old filename pattern (type: 'string')", () => {
    expect(PatternUtil.convertFromV1Pattern("'%s.txt'", "message.date")).toBe(
      "${message.subject}.txt",
    )
  })
  it("should support all old filename substitution parameters (type: '%s','%o','%filename','#SUBJECT#','#FILE#',yyyy-mm-dd)", () => {
    expect(
      PatternUtil.convertFromV1Pattern(
        "'%s,%o,%filename,#SUBJECT#,#FILE#,'yyyy-MM-dd",
        "message.date",
      ),
    ).toBe(
      "${message.subject},${attachment.name},${attachment.name},${message.subject},${attachment.name},${message.date:dateformat:YYYY-MM-DD}",
    )
  })
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