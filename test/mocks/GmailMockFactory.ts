import { mock } from "jest-mock-extended"

export class GmailMockFactory {
  public static newThreadMock(
    data: any = {},
  ): GoogleAppsScript.Gmail.GmailThread {
    data = GmailMockFactory.getThreadSampleData(data)
    data.messages = data.messages !== undefined ? data.messages : []
    const mockedGmailThread = mock<GoogleAppsScript.Gmail.GmailThread>()
    mockedGmailThread.getFirstMessageSubject.mockReturnValue(
      data.firstMessageSubject,
    )
    mockedGmailThread.hasStarredMessages.mockReturnValue(
      data.hasStarredMessages,
    )
    mockedGmailThread.getId.mockReturnValue(data.id)
    mockedGmailThread.isImportant.mockReturnValue(data.isImportant)
    mockedGmailThread.isInPriorityInbox.mockReturnValue(data.isInPriorityInbox)
    mockedGmailThread.getLabels.mockReturnValue(data.labels)
    mockedGmailThread.getLastMessageDate.mockReturnValue(data.lastMessageDate)
    mockedGmailThread.getMessageCount.mockReturnValue(data.messageCount)
    mockedGmailThread.getPermalink.mockReturnValue(data.permalink)
    mockedGmailThread.getMessages.mockReturnValue(
      GmailMockFactory.getMessages(data),
    )
    return mockedGmailThread
  }
  public static newMessageMock(
    data: any = {},
  ): GoogleAppsScript.Gmail.GmailMessage {
    data = GmailMockFactory.getMessageSampleData(data)
    data.attachments = data.attachments ? data.attachments : [] // Make sure attachments is defined
    const mockedGmailMessage = mock<GoogleAppsScript.Gmail.GmailMessage>()
    mockedGmailMessage.getAttachments.mockReturnValue(
      GmailMockFactory.getAttachments(data),
    )
    mockedGmailMessage.getBcc.mockReturnValue(data.bcc)
    mockedGmailMessage.getCc.mockReturnValue(data.cc)
    mockedGmailMessage.getDate.mockReturnValue(data.date)
    mockedGmailMessage.getFrom.mockReturnValue(data.from)
    mockedGmailMessage.getId.mockReturnValue(data.id)
    mockedGmailMessage.getReplyTo.mockReturnValue(data.replyTo)
    mockedGmailMessage.getSubject.mockReturnValue(data.subject)
    mockedGmailMessage.getTo.mockReturnValue(data.to)
    return mockedGmailMessage
  }
  public static newAttachmentMock(
    data: any = {},
  ): GoogleAppsScript.Gmail.GmailAttachment {
    data = GmailMockFactory.getAttachmentSampleData(data)
    const mockedGmailAttachment = mock<GoogleAppsScript.Gmail.GmailAttachment>()
    mockedGmailAttachment.getContentType.mockReturnValue(data.contentType)
    mockedGmailAttachment.getHash.mockReturnValue(data.hash)
    mockedGmailAttachment.getName.mockReturnValue(data.name)
    mockedGmailAttachment.getSize.mockReturnValue(data.size)
    mockedGmailAttachment.isGoogleType.mockReturnValue(data.isGoogleType)
    mockedGmailAttachment.getDataAsString.mockReturnValue(data.content) // TODO: Check, if this works for binaries too!
    return mockedGmailAttachment
  }
  private static getMessages(data: any): GoogleAppsScript.Gmail.GmailMessage[] {
    const a = []
    for (let i = 0; i < data.messages.length; i++) {
      a[i] = GmailMockFactory.newMessageMock(data.messages[i])
    }
    return a
  }
  private static getAttachments(
    data: any,
  ): GoogleAppsScript.Gmail.GmailAttachment[] {
    const a = []
    for (let i = 0; i < data.attachments.length; i++) {
      a[i] = GmailMockFactory.newAttachmentMock(data.attachments[i])
    }
    return a
  }
  private static lengthInUtf8Bytes(str: string) {
    // See https://stackoverflow.com/questions/5515869/string-length-in-bytes-in-javascript/5515960#5515960
    // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
    const m = encodeURIComponent(str).match(/%[89ABab]/g)
    return str.length + (m ? m.length : 0)
  }
  private static getThreadSampleData(data: any): any {
    data = typeof data === "undefined" ? { messages: [] } : data // Allows calling without data parameter
    const sampleMessages = [
      GmailMockFactory.getMessageSampleData(
        data.messages && data.messages.length > 0 ? data.messages[0] : {},
      ),
      GmailMockFactory.getMessageSampleData(
        data.messages && data.messages.length > 1 ? data.messages[1] : {},
      ),
    ]
    const sampleData = {
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

  private static getMessageSampleData(data: any) {
    data = typeof data === "undefined" ? {} : data // Allows calling without data parameter
    const sampleAttachments = [
      GmailMockFactory.getAttachmentSampleData({
        name: "attachment1.pdf",
        contentType: "application/pdf",
        content: "Sample PDF Content",
      }),
      GmailMockFactory.getAttachmentSampleData({
        name: "attachment2.txt",
        contentType: "text/plain",
        content: "Sample Text Content",
      }),
      GmailMockFactory.getAttachmentSampleData({
        name: "attachment3.jpg",
        contentType: "image/jpeg",
        content: "Sample JPEG Content",
      }),
    ]
    const sampleData = {
      bcc: "message-bcc@example.com",
      cc: "message-cc@example.com",
      date: new Date("2019-05-02T07:15:28"),
      from: "message-from@example.com",
      id: "message-id",
      subject: "message subject",
      to: "message-to@example.com",
      attachments: sampleAttachments,
    }
    Object.assign(sampleData, data)
    return sampleData
  }

  private static getAttachmentSampleData(data: any) {
    data = typeof data === "undefined" ? {} : data // Allows calling without data parameter
    const sampleContent =
      typeof data.content === "undefined" ? "Sample text content" : data.content
    const sampleData = {
      contentType: "text/plain",
      hash:
        typeof Utilities === "undefined" // NOTE: this fallback is done to run tests
          ? "some-hash-value" // locally without Google Apps Script
          : Utilities.computeDigest(
              Utilities.DigestAlgorithm.SHA_1,
              sampleContent,
            ),
      name: "attachment.txt",
      size: GmailMockFactory.lengthInUtf8Bytes(sampleContent),
      isGoogleType: false,
      content: sampleContent,
    }
    Object.assign(sampleData, data)
    return sampleData
  }
}
