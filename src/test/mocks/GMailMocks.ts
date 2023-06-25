import { createHash } from "crypto"
import { MockProxy, mock } from "jest-mock-extended"
import { RequiredDeep } from "../../lib/utils/UtilityTypes"
import { Mocks } from "./MockFactory"

export type ThreadData = {
  // NOTE: Keep ThreadData, newThreadMock and getThreadSampleData in sync
  firstMessageSubject?: string
  hasStarredMessages?: boolean
  id?: string
  isImportant?: boolean
  isInChats?: boolean
  isInInbox?: boolean
  isInPriorityInbox?: boolean
  isInSpam?: boolean
  isInTrash?: boolean
  isUnread?: boolean
  labels?: string[]
  lastMessageDate?: Date
  messageCount?: number
  messages?: MessageData[]
  permalink?: string
}
type RequiredThreadData = RequiredDeep<ThreadData>
type MessageData = {
  // NOTE: Keep MessageData, newMessageMock and getMessageSampleData in sync
  attachments?: AttachmentData[]
  bcc?: string
  cc?: string
  date?: Date
  from?: string
  id?: string
  isDraft?: boolean
  isInChats?: boolean
  isInInbox?: boolean
  isInPriorityInbox?: boolean
  isInTrash?: boolean
  isStarred?: boolean
  isUnread?: boolean
  replyTo?: string
  subject?: string
  to?: string
}
type RequiredMessageData = RequiredDeep<MessageData>
type AttachmentData = {
  // NOTE: Keep AttachmentData, newAttachmentMock and getAttachmentSampleData in sync
  contentType?: string
  hash?: string
  name?: string
  size?: number
  isGoogleType?: boolean
  content?: string
}
type RequiredAttachmentData = RequiredDeep<AttachmentData>

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
    // NOTE: Keep ThreadData, newThreadMock and getThreadSampleData in sync
    const d = this.getThreadSampleData(data)
    d.messages = d.messages !== undefined ? d.messages : []
    const t = mock<GoogleAppsScript.Gmail.GmailThread>()
    t.addLabel.mockReturnValue(t)
    t.getFirstMessageSubject.mockReturnValue(d.firstMessageSubject)
    t.getId.mockReturnValue(d.id)
    t.getLabels.mockReturnValue(
      (d.labels ?? []).map((l) => {
        const ml = mock<GoogleAppsScript.Gmail.GmailLabel>()
        ml.getName.mockReturnValue(l)
        return ml
      }),
    )
    t.getLastMessageDate.mockReturnValue(d.lastMessageDate)
    t.getMessageCount.mockReturnValue(d.messageCount)
    t.getMessages.mockReturnValue(this.getMessages(d))
    t.getPermalink.mockReturnValue(d.permalink)
    t.hasStarredMessages.mockReturnValue(d.hasStarredMessages)
    t.isImportant.mockReturnValue(d.isImportant)
    t.isInChats.mockReturnValue(d.isInChats)
    t.isInInbox.mockReturnValue(d.isInInbox)
    t.isInPriorityInbox.mockReturnValue(d.isInPriorityInbox)
    t.isInSpam.mockReturnValue(d.isInSpam)
    t.isInTrash.mockReturnValue(d.isInTrash)
    t.isUnread.mockReturnValue(d.isUnread)
    t.markImportant.mockReturnValue(t)
    t.markRead.mockReturnValue(t)
    t.markUnimportant.mockReturnValue(t)
    t.markUnread.mockReturnValue(t)
    t.moveToArchive.mockReturnValue(t)
    t.moveToInbox.mockReturnValue(t)
    t.moveToSpam.mockReturnValue(t)
    t.moveToTrash.mockReturnValue(t)
    t.removeLabel.mockReturnValue(t)
    return t
  }

  public static newMessageMock(
    data: MessageData = {},
  ): MockProxy<GoogleAppsScript.Gmail.GmailMessage> {
    // NOTE: Keep MessageData, newMessageMock and getMessageSampleData in sync
    const d = this.getMessageSampleData(data)
    d.attachments = d.attachments ? d.attachments : []
    const m = mock<GoogleAppsScript.Gmail.GmailMessage>()
    m.forward.mockReturnValue(m)
    m.getAttachments.mockReturnValue(this.getAttachments(d))
    m.getBcc.mockReturnValue(d.bcc)
    m.getCc.mockReturnValue(d.cc)
    m.getDate.mockReturnValue(d.date)
    m.getFrom.mockReturnValue(d.from)
    m.getId.mockReturnValue(d.id)
    m.getReplyTo.mockReturnValue(d.replyTo)
    m.getSubject.mockReturnValue(d.subject)
    m.getTo.mockReturnValue(d.to)
    m.isDraft.mockReturnValue(d.isDraft)
    m.isInChats.mockReturnValue(d.isInChats)
    m.isInInbox.mockReturnValue(d.isInInbox)
    m.isInPriorityInbox.mockReturnValue(d.isInPriorityInbox)
    m.isInTrash.mockReturnValue(d.isInTrash)
    m.isStarred.mockReturnValue(d.isStarred)
    m.isUnread.mockReturnValue(d.isUnread)
    m.forward.mockReturnValue(m)
    m.markRead.mockReturnValue(m)
    m.markUnread.mockReturnValue(m)
    m.moveToTrash.mockReturnValue(m)
    m.star.mockReturnValue(m)
    m.unstar.mockReturnValue(m)
    return m
  }

  public static newAttachmentMock(
    data: AttachmentData = {},
  ): MockProxy<GoogleAppsScript.Gmail.GmailAttachment> {
    // NOTE: Keep AttachmentData, newAttachmentMock and getAttachmentSampleData in sync
    const d = this.getAttachmentSampleData(data)
    const a = mock<GoogleAppsScript.Gmail.GmailAttachment>()
    a.getContentType.mockReturnValue(d.contentType)
    a.getDataAsString.mockReturnValue(d.content)
    a.getHash.mockReturnValue(d.hash)
    a.getName.mockReturnValue(d.name)
    a.getSize.mockReturnValue(d.size)
    a.isGoogleType.mockReturnValue(d.isGoogleType)
    return a
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

  public static getThreadSampleData(data: ThreadData = {}): RequiredThreadData {
    // NOTE: Keep ThreadData, newThreadMock and getThreadSampleData in sync
    const messages = (
      data.messages ?? [
        this.getMessageSampleData({ subject: "Message 1" }),
        this.getMessageSampleData({ subject: "Message 2" }),
      ]
    ).map((msg) => this.getMessageSampleData(msg))
    const newData: RequiredThreadData = {
      firstMessageSubject: messages[0].subject,
      hasStarredMessages: data.hasStarredMessages ?? false,
      id: data.id ?? "threadId123",
      isImportant: data.isImportant ?? false,
      isInChats: data.isInChats ?? false,
      isInInbox: data.isInInbox ?? true,
      isInPriorityInbox: data.isInPriorityInbox ?? false,
      isInSpam: data.isInSpam ?? false,
      isInTrash: data.isInTrash ?? false,
      isUnread: data.isUnread ?? true,
      labels: data.labels ?? [],
      lastMessageDate: messages.reduce((lastMessage, currentMessage) =>
        lastMessage.date.getMilliseconds() <
        currentMessage.date.getMilliseconds()
          ? currentMessage
          : lastMessage,
      ).date,
      messageCount: messages.length,
      messages: messages,
      permalink: data.permalink ?? "some-permalink-url",
    }
    return newData
  }

  public static getMessageSampleData(
    data: MessageData = {},
  ): RequiredMessageData {
    // NOTE: Keep MessageData, newMessageMock and getMessageSampleData in sync
    const attachments = (
      data.attachments ?? [
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
    ).map((attachment) => this.getAttachmentSampleData(attachment))

    const sampleData: RequiredMessageData = {
      attachments: attachments,
      bcc: data.bcc ?? "message-bcc@example.com",
      cc: data.cc ?? "message-cc@example.com",
      date: data.date ?? new Date("2019-05-02T07:15:28Z"),
      from: data.from ?? "message-from@example.com",
      id: data.id ?? "message-id",
      isDraft: data.isDraft ?? false,
      isInChats: data.isInChats ?? false,
      isInInbox: data.isInInbox ?? true,
      isInPriorityInbox: data.isInPriorityInbox ?? false,
      isInTrash: data.isInTrash ?? false,
      isStarred: data.isStarred ?? false,
      isUnread: data.isUnread ?? true,
      replyTo: data.replyTo ?? "message-reply-to@example.com",
      subject: data.subject ?? "message subject",
      to: data.to ?? "message-to@example.com",
    }
    return sampleData
  }

  public static getAttachmentSampleData(
    data: AttachmentData = {},
  ): RequiredAttachmentData {
    // NOTE: Keep AttachmentData, newAttachmentMock and getAttachmentSampleData in sync
    const sampleContent = data.content ?? "Sample text content"
    const sampleData: RequiredAttachmentData = {
      contentType: data.contentType ?? "text/plain",
      hash: createHash("sha1").update(sampleContent).digest("hex"),
      name: data.name ?? "attachment.txt",
      size: this.lengthInUtf8Bytes(sampleContent),
      isGoogleType: data.isGoogleType ?? false,
      content: sampleContent,
    }
    return sampleData
  }

  public static lengthInUtf8Bytes(str: string) {
    // See https://stackoverflow.com/questions/5515869/string-length-in-bytes-in-javascript/5515960#5515960
    // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
    const m = encodeURIComponent(str).match(/%[89ABab]/g)
    return (str === undefined ? "" : str).length + (m ? m.length : 0)
  }
}
