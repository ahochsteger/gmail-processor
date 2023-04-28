import { mock } from "jest-mock-extended"
import {
  AttachmentContext,
  EnvContext,
  MessageContext,
  ProcessingContext,
  ThreadContext,
} from "../../src/Context"
import { ActionRegistry } from "../../src/actions/ActionRegistry"
import { AttachmentActions } from "../../src/actions/AttachmentActions"
import { MessageActions } from "../../src/actions/MessageActions"
import { ThreadActions } from "../../src/actions/ThreadActions"
import { GDriveAdapter } from "../../src/adapter/GDriveAdapter"
import { GmailAdapter } from "../../src/adapter/GmailAdapter"
import { SpreadsheetAdapter } from "../../src/adapter/SpreadsheetAdapter"
import { AttachmentConfig } from "../../src/config/AttachmentConfig"
import { Config, jsonToConfig } from "../../src/config/Config"
import { MessageConfig } from "../../src/config/MessageConfig"
import { MessageFlag } from "../../src/config/MessageFlag"
import { ThreadConfig, jsonToThreadConfig } from "../../src/config/ThreadConfig"
import { V1Config, jsonToV1Config } from "../../src/config/v1/V1Config"
import { Timer } from "../../src/utils/Timer"

export class Mocks {
  // Create Google Apps Script Context mock objects:
  public envContext: EnvContext
  public gmailApp = mock<GoogleAppsScript.Gmail.GmailApp>()
  public gdriveApp = mock<GoogleAppsScript.Drive.DriveApp>()
  public spreadsheetApp = mock<GoogleAppsScript.Spreadsheet.SpreadsheetApp>()
  public cacheService = mock<GoogleAppsScript.Cache.CacheService>()
  public utilities = mock<GoogleAppsScript.Utilities.Utilities>()
  public processingContext: ProcessingContext

  // Objects for behavior mocking:
  public thread = MockFactory.newThreadMock()
  public threadContext: ThreadContext
  public threadActions: ThreadActions
  public message = MockFactory.newMessageMock()
  public messageContext: MessageContext
  public messageActions: MessageActions
  public attachment = MockFactory.newAttachmentMock()
  public attachmentContext: AttachmentContext
  public attachmentActions: AttachmentActions
  public folder = mock<GoogleAppsScript.Drive.Folder>()
  public file = mock<GoogleAppsScript.Drive.File>()
  public fileIterator = mock<GoogleAppsScript.Drive.FileIterator>()
  public folderIterator = mock<GoogleAppsScript.Drive.FolderIterator>()
  public cache = mock<GoogleAppsScript.Cache.Cache>()
  public blob = mock<GoogleAppsScript.Base.Blob>()

  constructor(config = new Config(), dryRun = true) {
    // Setup mock behavior:
    this.folder.getFilesByName.mockReturnValue(this.fileIterator)
    this.folder.createFile.mockReturnValue(this.file)
    this.gdriveApp.getRootFolder.mockReturnValue(this.folder)
    this.gdriveApp.getFoldersByName.mockReturnValue(this.folderIterator)
    this.cache.get.mockReturnValue("some-id")
    this.cacheService.getScriptCache.mockReturnValue(this.cache)
    this.envContext = {
      // TODO: Merge with newEnvContextMock()
      gmailApp: this.gmailApp,
      gdriveApp: this.gdriveApp,
      utilities: this.utilities,
      spreadsheetApp: this.spreadsheetApp,
      cacheService: this.cacheService,
      dryRun,
      timer: new Timer(),
    }
    this.processingContext = MockFactory.newProcessingContextMock(
      this.envContext,
      config,
      dryRun,
    )
    this.threadActions = new ThreadActions()
    this.threadContext = {
      // TODO: Merge with newThreadContextMock()
      ...this.processingContext,
      threadActions: this.threadActions,
      threadConfigIndex: 0,
      threadConfig: new ThreadConfig(),
      threadIndex: 0,
      thread: this.thread,
    }
    this.messageActions = new MessageActions()
    this.messageContext = {
      // TODO: Merge with newMessageContextMock()
      ...this.threadContext,
      messageActions: this.messageActions,
      messageConfigIndex: 0,
      messageConfig: new MessageConfig(),
      messageIndex: 0,
      message: this.message,
    }
    this.attachmentActions = new AttachmentActions()
    this.attachmentContext = {
      // TODO: Merge with newAttachmentContextMock()
      ...this.messageContext,
      attachmentActions: this.attachmentActions,
      attachmentConfigIndex: 0,
      attachmentConfig: new AttachmentConfig(),
      attachmentIndex: 0,
      attachment: this.attachment,
    }
    this.blob.getAs.mockReturnValue(this.blob)
    this.blob.getDataAsString.mockReturnValue("PDF-Contents")
    this.utilities.newBlob.mockReturnValue(this.blob)
    this.gmailApp.search.mockReturnValue([this.thread])
  }
}

export class MockFactory {
  public static newMocks(config = new Config(), dryRun = true): Mocks {
    return new Mocks(config, dryRun)
  }

  public static newEnvContextMock(mocks = new Mocks(), dryRun = true) {
    const envContext: EnvContext = {
      gmailApp: mocks.gmailApp,
      gdriveApp: mocks.gdriveApp,
      utilities: mocks.utilities,
      spreadsheetApp: mocks.spreadsheetApp,
      cacheService: mocks.cacheService,
      dryRun,
      timer: new Timer(),
    }
    return envContext
  }

  public static newDefaultSettingsConfigJson(): Record<string, unknown> {
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

  public static newDefaultActionConfigJson(): Record<string, unknown> {
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

  public static newDefaultAttachmentConfigJson(
    includeCommands = false,
  ): Record<string, unknown> {
    return {
      name: "default-attachment-config",
      description: "Default attachment config",
      actions: includeCommands ? [this.newDefaultActionConfigJson()] : [],
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

  public static newDefaultMessageConfigJson(
    includeCommands = false,
    includeAttachmentConfigs = false,
  ): Record<string, unknown> {
    return {
      name: "default-message-config",
      description: "Default message config",
      match: {
        from: "(.+)@example.com",
        subject: "Prefix - (.*) - Suffix(.*)",
        to: "my\\.address\\+(.+)@gmail.com",
        is: [MessageFlag.UNREAD],
        newerThan: "",
        olderThan: "",
      },
      actions: includeCommands ? [this.newDefaultActionConfigJson()] : [],
      attachments: includeAttachmentConfigs
        ? [this.newDefaultAttachmentConfigJson()]
        : [],
    }
  }

  public static newDefaultThreadConfigJson(
    includeCommands = false,
    includeMessages = false,
  ): Record<string, unknown> {
    return {
      name: "default-thread-config",
      description: "A sample thread config",
      actions: includeCommands ? [this.newDefaultActionConfigJson()] : [],
      messages: includeMessages ? [this.newDefaultMessageConfigJson()] : [],
      match: {
        query: "has:attachment from:example@example.com",
        maxMessageCount: -1,
        minMessageCount: -1,
        newerThan: "",
      },
      attachments: [],
    }
  }

  public static newComplexThreadConfigList(): Record<string, unknown>[] {
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
        hessageHandler: [
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
        hessageHandler: [
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
            attachments: [
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

  public static newDefaultConfigJson(): Record<string, unknown> {
    return {
      settings: this.newDefaultSettingsConfigJson(),
      threads: this.newComplexThreadConfigList(),
    }
  }

  public static newDefaultV1ConfigJson(): Record<string, unknown> {
    return {
      globalFilter: "has:attachment -in:trash -in:drafts -in:spam",
      processedLabel: "gmail2gdrive/client-test",
      sleepTime: 100,
      maxRuntime: 280,
      newerThan: "1d",
      timezone: "UTC",
      rules: [
        {
          filter: "to:my.name+scans@gmail.com",
          folder: "'Scans'-yyyy-MM-dd",
        },
        {
          filter: "from:example1@example.com",
          folder: "'Examples/example1'",
        },
        {
          filter: "from:example2@example.com",
          folder: "'Examples/example2'",
          filenameFromRegexp: ".*.pdf$",
        },
        {
          filter: "(from:example3a@example.com OR from:example3b@example.com)",
          folder: "'Examples/example3ab'",
          filenameTo: "'file-'yyyy-MM-dd-'%s.txt'",
          archive: true,
        },
        {
          filter: "label:PDF",
          saveThreadPDF: true,
          folder: "PDF Emails",
        },
        {
          filter: "from:example4@example.com",
          folder: "'Examples/example4'",
          filenameFrom: "file.txt",
          filenameTo: "'file-'yyyy-MM-dd-'%s.txt'",
        },
      ],
    }
  }

  public static newDefaultV1Config(): V1Config {
    const v1config = this.newDefaultV1ConfigJson()
    return jsonToV1Config(v1config)
  }

  public static newDefaultConfig(): Config {
    return jsonToConfig({
      threads: this.newComplexThreadConfigList(),
    })
  }

  public static newProcessingContextMock(
    envContext = this.newEnvContextMock(),
    config = new Config(),
    dryRun = true,
  ): ProcessingContext {
    return {
      ...envContext,
      gdriveAdapter: new GDriveAdapter(envContext),
      gmailAdapter: new GmailAdapter(envContext),
      spreadsheetAdapter: new SpreadsheetAdapter(envContext),
      config,
      dryRun,
      actionRegistry: new ActionRegistry(),
    }
  }

  public static newThreadContextMock(
    processingContext = this.newProcessingContextMock(),
    threadConfig = this.newDefaultThreadConfigJson(),
    thread = this.newThreadMock(),
  ): ThreadContext {
    jsonToThreadConfig(threadConfig)
    return {
      ...processingContext,
      threadConfig: jsonToThreadConfig(threadConfig),
      thread,
      threadActions: new ThreadActions(),
      threadConfigIndex: 0,
      threadIndex: 0,
    }
  }

  public static newMessageContextMock(
    threadContext = this.newThreadContextMock(),
    messageConfig = new MessageConfig(),
    message = this.newMessageMock(),
  ): MessageContext {
    return {
      ...threadContext,
      messageConfig,
      message,
      messageActions: new MessageActions(),
      messageConfigIndex: 0,
      messageIndex: 0,
    }
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
    mockedGmailThread.markImportant.mockReturnValue(mockedGmailThread)
    return mockedGmailThread
  }

  public static newMessageMock(
    data1: Record<string, unknown> = {},
  ): GoogleAppsScript.Gmail.GmailMessage {
    const msgData = MockFactory.getMessageSampleData(data1)
    msgData.attachments = msgData.attachments ? msgData.attachments : [] // Make sure attachments is defined
    const mockedGmailMessage = mock<GoogleAppsScript.Gmail.GmailMessage>()
    mockedGmailMessage.forward.mockReturnValue(mockedGmailMessage)
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
    // TODO: Merge with newThreadContextMock()
    thread: GoogleAppsScript.Gmail.GmailThread,
    threadIndex = 0,
    threadConfig = new ThreadConfig(),
    config = new Config(),
    dryRun = true,
  ) {
    config.threads.push(threadConfig)

    const ctx: ThreadContext = {
      ...MockFactory.newProcessingContextMock(),
      config,
      dryRun,
      thread,
      threadActions: new ThreadActions(),
      threadConfig,
      threadConfigIndex: 0,
      threadIndex,
    }
    ctx.threadIndex = threadIndex + 1
    return ctx
  }

  public static newMessageContext(
    // TODO: Merge with newMessageContextMock()
    thread: GoogleAppsScript.Gmail.GmailThread,
    threadIndex = 0,
    messageIndex = 0,
    messageConfig = new MessageConfig(),
    threadConfig = new ThreadConfig(),
    config = new Config(),
  ) {
    threadConfig.messages.push(messageConfig)
    config.threads.push(threadConfig)
    const message = thread.getMessages()[messageIndex]

    const ctx: MessageContext = {
      ...MockFactory.newThreadContext(
        thread,
        threadIndex,
        threadConfig,
        config,
      ),
      message,
      messageActions: new MessageActions(),
      messageConfig,
      messageConfigIndex: 0,
      messageIndex,
    }
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
    messageConfig.attachments.push(attachmentConfig)
    threadConfig.messages.push(messageConfig)
    config.threads.push(threadConfig)
    const message = thread.getMessages()[messageIndex]
    const attachment = message.getAttachments()[attachmentIndex]

    const ctx: AttachmentContext = {
      ...MockFactory.newMessageContext(
        thread,
        threadIndex,
        messageIndex,
        messageConfig,
        threadConfig,
      ),
      attachment,
      attachmentActions: new AttachmentActions(),
      attachmentConfig,
      attachmentConfigIndex: 0,
      attachmentIndex,
    }
    ctx.attachmentIndex = attachmentIndex + 1
    return ctx
  }
}
