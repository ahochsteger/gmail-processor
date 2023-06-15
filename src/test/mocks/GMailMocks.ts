import { createHash } from "crypto"
import { MockProxy, mock } from "jest-mock-extended"
import { RequiredDeep } from "../../lib/utils/UtilityTypes"
import { Mocks } from "./MockFactory"

type ThreadData = {
  firstMessageSubject?: string
  hasStarredMessages?: boolean
  id?: string
  isImportant?: boolean
  isInPriorityInbox?: boolean
  labels?: string[]
  lastMessageDate?: Date
  messageCount?: number
  permalink?: string
  messages?: MessageData[]
}
type MessageData = {
  bcc?: string
  cc?: string
  date?: Date
  from?: string
  id?: string
  subject?: string
  to?: string
  replyTo?: string
  attachments?: AttachmentData[]
  isStarred?: boolean
  isUnread?: boolean
}
type AttachmentData = {
  contentType?: string
  hash?: string
  name?: string
  size?: number
  isGoogleType?: boolean
  content?: string
}

export class GMailMocks {
  public static setupAllMocks(mocks: Mocks) {
    mocks.thread = this.newThreadMock()
    mocks.message = this.newMessageMock()
    mocks.attachment = this.newAttachmentMock()
    mocks.gmailApp.search.mockReturnValue([mocks.thread])
  }

  public static newThreadMock(
    data: ThreadData = {},
  ): MockProxy<GoogleAppsScript.Gmail.GmailThread> {
    const threadData = this.getThreadSampleData(data)
    threadData.messages =
      threadData.messages !== undefined ? threadData.messages : []
    const mockedGmailThread = mock<GoogleAppsScript.Gmail.GmailThread>()
    mockedGmailThread.getFirstMessageSubject.mockReturnValue(
      threadData.firstMessageSubject as string,
    )
    mockedGmailThread.hasStarredMessages.mockReturnValue(
      threadData.hasStarredMessages as boolean,
    )
    const dataLabels: string[] =
      threadData.labels !== undefined ? (threadData.labels as string[]) : []
    const mockedLabels: GoogleAppsScript.Gmail.GmailLabel[] = []
    dataLabels.forEach((l: string) => {
      const mockedLabel = mock<GoogleAppsScript.Gmail.GmailLabel>()
      mockedLabel.getName.mockReturnValue(l)
      mockedLabels.push(mockedLabel)
    })
    mockedGmailThread.getId.mockReturnValue(threadData.id as string)
    mockedGmailThread.isImportant.mockReturnValue(
      threadData.isImportant as boolean,
    )
    mockedGmailThread.isInPriorityInbox.mockReturnValue(
      threadData.isInPriorityInbox as boolean,
    )
    mockedGmailThread.getLabels.mockReturnValue(mockedLabels)
    mockedGmailThread.getLastMessageDate.mockReturnValue(
      threadData.lastMessageDate as Date,
    )
    mockedGmailThread.getMessageCount.mockReturnValue(
      threadData.messageCount as number,
    )
    mockedGmailThread.getPermalink.mockReturnValue(
      threadData.permalink as string,
    )
    mockedGmailThread.getMessages.mockReturnValue(this.getMessages(threadData))
    mockedGmailThread.markImportant.mockReturnValue(mockedGmailThread)
    return mockedGmailThread
  }

  public static newMessageMock(
    data1: MessageData = {},
  ): MockProxy<GoogleAppsScript.Gmail.GmailMessage> {
    const msgData = this.getMessageSampleData(data1)
    msgData.attachments = msgData.attachments ? msgData.attachments : [] // Make sure attachments is defined
    const mockedGmailMessage = mock<GoogleAppsScript.Gmail.GmailMessage>()
    mockedGmailMessage.forward.mockReturnValue(mockedGmailMessage)
    mockedGmailMessage.getAttachments.mockReturnValue(
      this.getAttachments(msgData),
    )
    mockedGmailMessage.getBcc.mockReturnValue(msgData.bcc)
    mockedGmailMessage.getCc.mockReturnValue(msgData.cc)
    mockedGmailMessage.getDate.mockReturnValue(msgData.date)
    mockedGmailMessage.getFrom.mockReturnValue(msgData.from)
    mockedGmailMessage.getId.mockReturnValue(msgData.id)
    mockedGmailMessage.getReplyTo.mockReturnValue(msgData.replyTo)
    mockedGmailMessage.getSubject.mockReturnValue(msgData.subject)
    mockedGmailMessage.getTo.mockReturnValue(msgData.to)
    mockedGmailMessage.isStarred.mockReturnValue(msgData.isStarred)
    mockedGmailMessage.isUnread.mockReturnValue(msgData.isUnread)
    return mockedGmailMessage
  }

  public static newAttachmentMock(
    data: AttachmentData = {},
  ): MockProxy<GoogleAppsScript.Gmail.GmailAttachment> {
    const attData = this.getAttachmentSampleData(data)
    const mockedGmailAttachment = mock<GoogleAppsScript.Gmail.GmailAttachment>()
    mockedGmailAttachment.getContentType.mockReturnValue(attData.contentType)
    mockedGmailAttachment.getHash.mockReturnValue(attData.hash)
    mockedGmailAttachment.getName.mockReturnValue(attData.name)
    mockedGmailAttachment.getSize.mockReturnValue(attData.size)
    mockedGmailAttachment.isGoogleType.mockReturnValue(
      attData.isGoogleType as boolean,
    )
    mockedGmailAttachment.getDataAsString.mockReturnValue(
      attData.content as string,
    )
    return mockedGmailAttachment
  }

  public static getMessages(data: {
    messages: MessageData[]
  }): GoogleAppsScript.Gmail.GmailMessage[] {
    const dataMessages = data.messages !== undefined ? data.messages : []
    const a: GoogleAppsScript.Gmail.GmailMessage[] = []
    dataMessages.forEach((dm) => a.push(this.newMessageMock(dm)))
    return a
  }

  public static getAttachments(data: {
    attachments: AttachmentData[]
  }): GoogleAppsScript.Gmail.GmailAttachment[] {
    const a: GoogleAppsScript.Gmail.GmailAttachment[] = []
    const dataAttachments =
      data.attachments !== undefined ? data.attachments : []
    dataAttachments.forEach((da) => a.push(this.newAttachmentMock(da)))
    return a
  }

  public static getThreadSampleData(
    data: ThreadData = {},
  ): RequiredDeep<ThreadData> {
    const dataMessages = data.messages
    const sampleMessages = [
      this.getMessageSampleData(
        dataMessages && dataMessages.length > 0 ? dataMessages[0] : {},
      ),
      this.getMessageSampleData(
        dataMessages && dataMessages.length > 1 ? dataMessages[1] : {},
      ),
    ]
    const sampleData: RequiredDeep<ThreadData> = {
      firstMessageSubject: sampleMessages[0].subject,
      hasStarredMessages: false,
      id: "threadId123",
      isImportant: false,
      isInPriorityInbox: false,
      labels: [],
      lastMessageDate: sampleMessages[sampleMessages.length - 1].date,
      messageCount: sampleMessages.length,
      permalink: "some-permalink-url",
      messages: sampleMessages,
    }
    Object.assign(sampleData, data)
    return sampleData
  }

  public static getMessageSampleData(
    data: MessageData = {},
  ): RequiredDeep<MessageData> {
    const sampleAttachments: RequiredDeep<AttachmentData>[] = [
      this.getAttachmentSampleData({
        name: "attachment1.pdf",
        contentType: "application/pdf",
        content: "Sample PDF Content",
      }),
      this.getAttachmentSampleData({
        name: "attachment2.txt",
        contentType: "text/plain",
        content: "Sample Text Content",
      }),
      this.getAttachmentSampleData({
        name: "attachment3.jpg",
        contentType: "image/jpeg",
        content: "Sample JPEG Content",
      }),
    ]
    const sampleData: RequiredDeep<MessageData> = {
      bcc: "message-bcc@example.com",
      cc: "message-cc@example.com",
      date: new Date("2019-05-02T07:15:28Z"),
      from: "message-from@example.com",
      id: "message-id",
      subject: "message subject",
      to: "message-to@example.com",
      replyTo: "message-reply-to@example.com",
      attachments: sampleAttachments,
      isStarred: false,
      isUnread: true,
    }
    Object.assign(sampleData, data)
    return sampleData
  }

  public static getAttachmentSampleData(
    data: AttachmentData = {},
  ): RequiredDeep<AttachmentData> {
    const sampleContent = data.content
      ? (data.content as string)
      : "Sample text content"
    const sampleData: RequiredDeep<AttachmentData> = {
      contentType: "text/plain",
      hash: createHash("sha1").update(sampleContent).digest("hex"),
      name: "attachment.txt",
      size: this.lengthInUtf8Bytes(sampleContent),
      isGoogleType: false,
      content: sampleContent,
    }
    Object.assign(sampleData, data)
    return sampleData
  }

  public static lengthInUtf8Bytes(str: string) {
    // See https://stackoverflow.com/questions/5515869/string-length-in-bytes-in-javascript/5515960#5515960
    // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
    const m = encodeURIComponent(str).match(/%[89ABab]/g)
    return (str === undefined ? "" : str).length + (m ? m.length : 0)
  }
}
