import { Config } from "../../src/config/Config"
import { mock } from "jest-mock-extended"
import { ProcessingContext } from "../../src/context/ProcessingContext"
import { GmailProcessor } from "../../src/processors/GmailProcessor"
import { ThreadProcessor } from "../../src/processors/ThreadProcessor"
import { GoogleAppsScriptContext } from "../../src/context/GoogleAppsScriptContext"
import { Mocks } from "./Mocks"
import { ThreadContext } from "../../src/context/ThreadContext"
import { MessageConfig } from "../../src/config/MessageConfig"
import { MessageContext } from "../../src/context/MessageContext"
import { AttachmentConfig } from "../../src/config/AttachmentConfig"
import { AttachmentContext } from "../../src/context/AttachmentContext"
import { ThreadConfig } from "../../src/config/ThreadConfig"
import { ActionConfig } from "../../src/config/ActionConfig"
import { MessageFlag } from "../../src/config/MessageFlag"
import { SettingsConfig } from "../../src/config/SettingsConfig"

export class MockFactory {
  public static newGasContextMock(mocks = new Mocks()) {
    const gasContext: GoogleAppsScriptContext = new GoogleAppsScriptContext(
      mocks.gmailApp,
      mocks.gdriveApp,
      mocks.console,
      mocks.utilities,
      mocks.spreadsheetApp,
      mocks.cacheService,
    )
    return gasContext
  }

  public static newDefaultSettingsConfig(): Partial<SettingsConfig> {
    return {
      maxBatchSize: 100,
      maxRuntime: 280,
      processedLabel: "to-gdrive/processed",
      sleepTimeThreads: 100,
      sleepTimeMessages: 10,
      sleepTimeAttachments: 1,
      timezone: "UTC",
    }
  }

  public static newDefaultActionConfig(): ActionConfig {
    return {
      args: {
        folderType: "path",
        folder: "Folder2/Subfolder2/${message.subject.match.1}",
        filename: "${message.subject} - ${match.file.1}.jpg",
        onExists: "replace",
      },
      name: "file.storeToGDrive",
      description: "Default action config",
    }
  }

  public static newDefaultAttachmentConfig(
    includeCommands = false,
  ): AttachmentConfig {
    return {
      name: "default-attachment-config",
      description: "Default attachment config",
      type: "attachment",
      actions: includeCommands ? [this.newDefaultActionConfig()] : [],
      match: {
        name: "Image-([0-9]+)\\.jpg",
        contentType: "image/.+",
        includeAttachments: true,
        includeInlineImages: true,
        largerThan: -1,
        smallerThan: -1,
      },
    }
  }

  public static newDefaultMessageConfig(
    includeCommands = false,
    includeAttachmentConfigs = false,
  ): MessageConfig {
    return {
      name: "default-message-config",
      description: "Default message config",
      type: "message",
      match: {
        from: "(.+)@example.com",
        subject: "Prefix - (.*) - Suffix(.*)",
        to: "my\\.address\\+(.+)@gmail.com",
        is: [MessageFlag.UNREAD],
        newerThan: "",
        olderThan: "",
      },
      actions: includeCommands ? [this.newDefaultActionConfig()] : [],
      handler: includeAttachmentConfigs
        ? [this.newDefaultAttachmentConfig()]
        : [],
    }
  }

  public static newDefaultThreadConfig(
    includeCommands = false,
    includeMessages = false,
  ): ThreadConfig {
    return {
      name: "default-thread-config",
      description: "A sample thread config",
      type: "thread",
      actions: includeCommands ? [this.newDefaultActionConfig()] : [],
      handler: includeMessages ? [this.newDefaultMessageConfig()] : [],
      match: {
        query: "has:attachment from:example@example.com",
        maxMessageCount: -1,
        minMessageCount: -1,
        newerThan: "",
      },
    }
  }

  public static newComplexThreadConfigList(): unknown[] {
    // TODO: Continue here (make fields optional in config)
    return [
      {
        actions: [
          {
            name: "attachment.storeToGDrive",
            args: { location: "Folder1/Subfolder1/${attachment.name}" },
          },
        ],
        description:
          "Example that stores all attachments of all found threads to a certain GDrive folder",
        match: {
          query: "has:attachment from:example@example.com",
        },
      },
      {
        description:
          "Example that stores all attachments of matching messages to a certain GDrive folder",
        match: {
          query: "has:attachment from:example@example.com",
        },
        handler: [
          {
            actions: [
              {
                name: "attachment.storeToGDrive",
                args: { location: "Folder1/Subfolder1/${attachment.name}" },
              },
            ],
            match: {
              from: "(.+)@example.com",
              subject: "Prefix - (.*) - Suffix(.*)",
              to: "my\\.address\\+(.+)@gmail.com",
            },
          },
        ],
      },
      {
        match: {
          query: "has:attachment from:example4@example.com",
        },
        handler: [
          {
            match: {
              from: "(.+)@example.com",
              subject: "Prefix - (.*) - Suffix(.*)",
              to: "my\\.address\\+(.+)@gmail.com",
              is: ["unread"],
              // TODO: Find out how to match only read/unread or starred/unstarred messages?
            },
            actions: [
              // TODO: Decide if only actions of a certain type (thread, message, attachment) are allowed?
              // Pro: More flexible (e.g. forward message, if a certain attachment rule matches)
              { name: "markMessageRead" },
            ],
            handler: [
              {
                match: { name: "Image-([0-9]+)\\.jpg" },
                actions: [
                  {
                    name: "attachment.storeToGDrive",
                    args: {
                      location:
                        "Folder2/Subfolder2/${message.subject.match.1}/${email.subject} - ${match.att.1}.jpg",
                      conflictStrategy: "replace",
                    },
                  },
                ],
              },
              {
                match: { name: ".+\\..+" },
                actions: [
                  {
                    name: "storeAttachment",
                    args: {
                      location:
                        "Folder3/Subfolder3/${att.basename}-${date:yyyy-MM-dd}.${att.ext}",
                      conflictStrategy: "skip",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ]
  }

  public static newDefaultConfig(): unknown {
    return {
      handler: this.newComplexThreadConfigList(),
    }
  }

  public static newProcessingContextMock(
    gasContext = this.newGasContextMock(),
    config = new Config(),
    dryRun = true,
  ) {
    return new ProcessingContext(gasContext, config, dryRun)
  }

  public static newGmailProcessorMock(
    config: Config,
    gasContext = MockFactory.newGasContextMock(),
    dryRun = true,
  ) {
    const threadProcessor = new ThreadProcessor(
      new ProcessingContext(gasContext, config, dryRun),
    )
    const gmailProcessor = new GmailProcessor(
      gasContext,
      config,
      threadProcessor,
    )
    gmailProcessor.setLogger(gasContext.logger)
    return gmailProcessor
  }

  public static newThreadContextMock(
    processingContext = this.newProcessingContextMock(),
    threadConfig = this.newDefaultThreadConfig(),
    thread = this.newThreadMock(),
  ) {
    return new ThreadContext(processingContext, threadConfig, thread)
  }

  public static newMessageContextMock(
    threadContext = this.newThreadContextMock(),
    messageConfig = new MessageConfig(),
    message = this.newMessageMock(),
  ) {
    return new MessageContext(threadContext, messageConfig, message)
  }

  public static newThreadMock(
    data: Record<string, unknown> = {},
  ): GoogleAppsScript.Gmail.GmailThread {
    const threadData = MockFactory.getThreadSampleData(data)
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
    mockedGmailThread.getMessages.mockReturnValue(
      MockFactory.getMessages(threadData),
    )
    return mockedGmailThread
  }

  public static newMessageMock(
    data1: Record<string, unknown> = {},
  ): GoogleAppsScript.Gmail.GmailMessage {
    const msgData = MockFactory.getMessageSampleData(data1)
    msgData.attachments = msgData.attachments ? msgData.attachments : [] // Make sure attachments is defined
    const mockedGmailMessage = mock<GoogleAppsScript.Gmail.GmailMessage>()
    mockedGmailMessage.getAttachments.mockReturnValue(
      MockFactory.getAttachments(msgData),
    )
    mockedGmailMessage.getBcc.mockReturnValue(msgData.bcc as string)
    mockedGmailMessage.getCc.mockReturnValue(msgData.cc as string)
    mockedGmailMessage.getDate.mockReturnValue(msgData.date as Date)
    mockedGmailMessage.getFrom.mockReturnValue(msgData.from as string)
    mockedGmailMessage.getId.mockReturnValue(msgData.id as string)
    mockedGmailMessage.getReplyTo.mockReturnValue(msgData.replyTo as string)
    mockedGmailMessage.getSubject.mockReturnValue(msgData.subject as string)
    mockedGmailMessage.getTo.mockReturnValue(msgData.to as string)
    mockedGmailMessage.isStarred.mockReturnValue(msgData.isStarred as boolean)
    mockedGmailMessage.isUnread.mockReturnValue(msgData.isUnread as boolean)
    return mockedGmailMessage
  }

  public static newAttachmentMock(
    data: Record<string, unknown> = {},
  ): GoogleAppsScript.Gmail.GmailAttachment {
    const attData = MockFactory.getAttachmentSampleData(data)
    const mockedGmailAttachment = mock<GoogleAppsScript.Gmail.GmailAttachment>()
    mockedGmailAttachment.getContentType.mockReturnValue(
      attData.contentType as string,
    )
    mockedGmailAttachment.getHash.mockReturnValue(attData.hash as string)
    mockedGmailAttachment.getName.mockReturnValue(attData.name as string)
    mockedGmailAttachment.getSize.mockReturnValue(attData.size as number)
    mockedGmailAttachment.isGoogleType.mockReturnValue(
      attData.isGoogleType as boolean,
    )
    mockedGmailAttachment.getDataAsString.mockReturnValue(
      attData.content as string,
    )
    return mockedGmailAttachment
  }

  private static getMessages(
    data: Record<string, unknown>,
  ): GoogleAppsScript.Gmail.GmailMessage[] {
    const dataMessages =
      data.messages !== undefined
        ? (data.messages as Record<string, unknown>[])
        : []
    const a: GoogleAppsScript.Gmail.GmailMessage[] = []
    dataMessages.forEach((dm) => a.push(MockFactory.newMessageMock(dm)))
    return a
  }

  private static getAttachments(
    data: Record<string, unknown>,
  ): GoogleAppsScript.Gmail.GmailAttachment[] {
    const a: GoogleAppsScript.Gmail.GmailAttachment[] = []
    const dataAttachments =
      data.attachments !== undefined
        ? (data.attachments as Record<string, unknown>[])
        : []
    dataAttachments.forEach((da) => a.push(MockFactory.newAttachmentMock(da)))
    return a
  }

  private static lengthInUtf8Bytes(str: string) {
    // See https://stackoverflow.com/questions/5515869/string-length-in-bytes-in-javascript/5515960#5515960
    // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
    const m = encodeURIComponent(str).match(/%[89ABab]/g)
    return (str === undefined ? "" : str).length + (m ? m.length : 0)
  }

  private static getThreadSampleData(
    data: Record<string, unknown>,
  ): Record<string, unknown> {
    data = data === undefined ? { messages: [] } : data // Allows calling without data parameter
    const dataMessages = data.messages as Record<string, object>[]
    const sampleMessages = [
      MockFactory.getMessageSampleData(
        dataMessages && dataMessages.length > 0 ? dataMessages[0] : {},
      ),
      MockFactory.getMessageSampleData(
        dataMessages && dataMessages.length > 1 ? dataMessages[1] : {},
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

  private static getMessageSampleData(data: Record<string, unknown>) {
    data = typeof data === "undefined" ? {} : data // Allows calling without data parameter
    const sampleAttachments = [
      MockFactory.getAttachmentSampleData({
        name: "attachment1.pdf",
        contentType: "application/pdf",
        content: "Sample PDF Content",
      }),
      MockFactory.getAttachmentSampleData({
        name: "attachment2.txt",
        contentType: "text/plain",
        content: "Sample Text Content",
      }),
      MockFactory.getAttachmentSampleData({
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
      replyTo: "message-reply-to@example.com",
      attachments: sampleAttachments,
      isStarred: false,
      isUnread: true,
    }
    Object.assign(sampleData, data)
    return sampleData
  }

  private static getAttachmentSampleData(data: Record<string, unknown>) {
    data = typeof data === "undefined" ? {} : data // Allows calling without data parameter
    const sampleContent = data.content
      ? (data.content as string)
      : "Sample text content"
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
      size: MockFactory.lengthInUtf8Bytes(sampleContent),
      isGoogleType: false,
      content: sampleContent,
    }
    Object.assign(sampleData, data)
    return sampleData
  }

  public static newThreadContext(
    thread: GoogleAppsScript.Gmail.GmailThread,
    threadIndex = 0,
    threadConfig = new ThreadConfig(),
    config = new Config(),
    dryRun = true,
  ) {
    config.handler.push(threadConfig)

    const ctx = new ThreadContext(
      new ProcessingContext(MockFactory.newGasContextMock(), config, dryRun),
      threadConfig,
      thread,
    )
    ctx.threadIndex = threadIndex + 1
    return ctx
  }

  public static newMessageContext(
    thread: GoogleAppsScript.Gmail.GmailThread,
    threadIndex = 0,
    messageIndex = 0,
    messageConfig = new MessageConfig(),
    threadConfig = new ThreadConfig(),
    config = new Config(),
  ) {
    threadConfig.handler.push(messageConfig)
    config.handler.push(threadConfig)
    const message = thread.getMessages()[messageIndex]

    const ctx = new MessageContext(
      MockFactory.newThreadContext(thread, threadIndex, threadConfig, config),
      messageConfig,
      message,
    )
    ctx.messageIndex = messageIndex + 1
    return ctx
  }

  public static newAttachmentContext(
    thread: GoogleAppsScript.Gmail.GmailThread,
    threadIndex = 0,
    messageIndex = 0,
    attachmentIndex = 0,
    attachmentConfig = new AttachmentConfig(),
    messageConfig = new MessageConfig(),
    threadConfig = new ThreadConfig(),
    config = new Config(),
  ) {
    messageConfig.handler.push(attachmentConfig)
    threadConfig.handler.push(messageConfig)
    config.handler.push(threadConfig)
    const message = thread.getMessages()[messageIndex]
    const attachment = message.getAttachments()[attachmentIndex]

    const ctx = new AttachmentContext(
      MockFactory.newMessageContext(
        thread,
        threadIndex,
        messageIndex,
        messageConfig,
        threadConfig,
      ),
      attachmentConfig,
      attachment,
    )
    ctx.attachmentIndex = attachmentIndex + 1
    return ctx
  }
}
