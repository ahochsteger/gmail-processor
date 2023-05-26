import { MockProxy, mock } from "jest-mock-extended"
import { PartialDeep } from "type-fest"
import {
  AttachmentContext,
  EnvContext,
  MessageContext,
  ProcessingContext,
  RunMode,
  ThreadContext,
} from "../../lib/Context"
import { ActionRegistry } from "../../lib/actions/ActionRegistry"
import { GDriveAdapter } from "../../lib/adapter/GDriveAdapter"
import { GmailAdapter } from "../../lib/adapter/GmailAdapter"
import { SpreadsheetAdapter } from "../../lib/adapter/SpreadsheetAdapter"
import {
  AttachmentActionConfig,
  MessageActionConfig,
  ThreadActionConfig,
} from "../../lib/config/ActionConfig"
import {
  AttachmentConfig,
  newAttachmentConfig,
} from "../../lib/config/AttachmentConfig"
import {
  Config,
  RequiredConfig,
  jsonToConfig,
  newConfig,
} from "../../lib/config/Config"
import { MessageConfig, newMessageConfig } from "../../lib/config/MessageConfig"
import { MessageFlag } from "../../lib/config/MessageFlag"
import { SettingsConfig } from "../../lib/config/SettingsConfig"
import { ThreadConfig, jsonToThreadConfig } from "../../lib/config/ThreadConfig"
import { V1Config, jsonToV1Config } from "../../lib/config/v1/V1Config"
import { Logger } from "../../lib/utils/Logging"
import { Timer } from "../../lib/utils/Timer"

export class Mocks {
  public attachmentContext = mock<AttachmentContext>()
  public attachment = mock<GoogleAppsScript.Gmail.GmailAttachment>()
  public blob = mock<GoogleAppsScript.Base.Blob>()
  public cache = mock<GoogleAppsScript.Cache.Cache>()
  public cacheService = mock<GoogleAppsScript.Cache.CacheService>()
  public envContext = mock<EnvContext>()
  public fileIterator = mock<GoogleAppsScript.Drive.FileIterator>()
  public file = mock<GoogleAppsScript.Drive.File>()
  public folderIterator = mock<GoogleAppsScript.Drive.FolderIterator>()
  public folder = mock<GoogleAppsScript.Drive.Folder>()
  public gdriveApp = mock<GoogleAppsScript.Drive.DriveApp>()
  public gmailApp = mock<GoogleAppsScript.Gmail.GmailApp>()
  public messageContext = mock<MessageContext>()
  public message = mock<GoogleAppsScript.Gmail.GmailMessage>()
  public processingContext = mock<ProcessingContext>()
  public spreadsheetApp = mock<GoogleAppsScript.Spreadsheet.SpreadsheetApp>()
  public logSheetRange = mock<GoogleAppsScript.Spreadsheet.Range>()
  public logSheet = mock<GoogleAppsScript.Spreadsheet.Sheet>()
  public logSpreadsheet = mock<GoogleAppsScript.Spreadsheet.Spreadsheet>()
  public logSpreadsheetFile = mock<GoogleAppsScript.Drive.File>()
  public threadContext = mock<ThreadContext>()
  public thread = mock<GoogleAppsScript.Gmail.GmailThread>()
  public utilities = mock<GoogleAppsScript.Utilities.Utilities>()
}

export class MockFactory {
  public static newMocks(
    config = newConfig(),
    runMode = RunMode.DANGEROUS,
  ): Mocks {
    const mocks = new Mocks()
    mocks.thread = MockFactory.newThreadMock()
    mocks.message = MockFactory.newMessageMock()
    mocks.attachment = MockFactory.newAttachmentMock()

    mocks.envContext = MockFactory.newEnvContextMock(runMode, mocks)
    mocks.processingContext = MockFactory.newProcessingContextMock(
      mocks.envContext,
      config,
    )
    mocks.threadContext = MockFactory.newThreadContextMock(
      mocks.processingContext,
      mocks.thread,
    )
    mocks.messageContext = MockFactory.newMessageContextMock(
      mocks.threadContext,
      mocks.message,
    )
    mocks.attachmentContext = MockFactory.newAttachmentContextMock(
      mocks.messageContext,
      mocks.attachment,
    )

    return mocks
  }

  public static newEnvContextMock(
    runMode = RunMode.DANGEROUS,
    mocks = this.newMocks(),
  ) {
    // Setup mock behavior:
    mocks.folder.getFilesByName.mockReturnValue(mocks.fileIterator)
    mocks.folder.getFolders.mockReturnValue(mocks.folderIterator)
    mocks.folder.createFile.mockReturnValue(mocks.file)
    mocks.gdriveApp.getRootFolder.mockReturnValue(mocks.folder)
    mocks.gdriveApp.getFolderById.mockReturnValue(mocks.folder)
    mocks.gdriveApp.getFoldersByName.mockReturnValue(mocks.folderIterator)
    mocks.cache.get.mockReturnValue("some-id")
    mocks.cacheService.getScriptCache.mockReturnValue(mocks.cache)
    mocks.blob.getAs.mockReturnValue(mocks.blob)
    mocks.blob.getDataAsString.mockReturnValue("PDF-Contents")
    mocks.utilities.newBlob.mockReturnValue(mocks.blob)
    mocks.gmailApp.search.mockReturnValue([mocks.thread])

    // SpreadsheetAdapter Mocks:
    mocks.logSheet.getLastRow.mockReturnValue(3)
    mocks.logSheet.getRange.mockReturnValue(mocks.logSheetRange)
    mocks.logSheetRange.setValues.mockReturnValue(mocks.logSheetRange)
    mocks.logSpreadsheet.getId.mockReturnValue("some-spreadsheet-id")
    mocks.logSpreadsheet.getSheets.mockReturnValue([mocks.logSheet])
    mocks.spreadsheetApp.create.mockReturnValue(mocks.logSpreadsheet)
    mocks.spreadsheetApp.openById.mockReturnValue(mocks.logSpreadsheet)
    mocks.gdriveApp.getFileById.mockReturnValue(mocks.logSpreadsheetFile)
    mocks.logSpreadsheetFile.moveTo.mockReturnValue(mocks.logSpreadsheetFile)
    const envContext: EnvContext = {
      env: {
        gmailApp: mocks.gmailApp,
        gdriveApp: mocks.gdriveApp,
        spreadsheetApp: mocks.spreadsheetApp,
        cacheService: mocks.cacheService,
        utilities: mocks.utilities,
        runMode,
      },
      log: new Logger(),
    }
    return envContext
  }

  public static newDefaultSettingsConfigJson(): PartialDeep<SettingsConfig> {
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

  public static newDefaultThreadActionConfigJson(): PartialDeep<ThreadActionConfig> {
    return {
      args: {
        folderType: "path",
        folder: "Folder2/Subfolder2/${message.subject.match.1}",
        filename: "${message.subject} - ${match.file.1}.jpg",
        onExists: "replace",
      },
      name: "thread.storeAsPdfToGDrive",
      description: "Default action config",
    }
  }

  public static newDefaultMessageActionConfigJson(): PartialDeep<MessageActionConfig> {
    return {
      args: {
        folderType: "path",
        folder: "Folder2/Subfolder2/${message.subject.match.1}",
        filename: "${message.subject} - ${match.file.1}.jpg",
        onExists: "replace",
      },
      name: "message.storeAsPdfToGDrive",
      description: "Default action config",
    }
  }

  public static newDefaultAttachmentActionConfigJson(): PartialDeep<AttachmentActionConfig> {
    return {
      args: {
        folderType: "path",
        folder: "Folder2/Subfolder2/${message.subject.match.1}",
        filename: "${message.subject} - ${match.file.1}.jpg",
        onExists: "replace",
      },
      name: "attachment.storeToGDrive",
      description: "Default action config",
    }
  }

  public static newDefaultAttachmentConfigJson(
    includeCommands = false,
  ): PartialDeep<AttachmentConfig> {
    return {
      name: "default-attachment-config",
      description: "Default attachment config",
      actions: includeCommands
        ? [
            this.newDefaultAttachmentActionConfigJson() as AttachmentActionConfig,
          ]
        : [],
      match: {
        name: "Image-([0-9]+)\\.jpg",
        contentTypeRegex: "image/.+",
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
  ): PartialDeep<MessageConfig> {
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
      actions: includeCommands
        ? [this.newDefaultMessageActionConfigJson() as MessageActionConfig]
        : [],
      attachments: includeAttachmentConfigs
        ? [this.newDefaultAttachmentConfigJson()]
        : [],
    }
  }

  public static newDefaultThreadConfigJson(
    includeCommands = false,
    includeMessages = false,
  ): PartialDeep<ThreadConfig> {
    return {
      name: "default-thread-config",
      description: "A sample thread config",
      actions: includeCommands
        ? [this.newDefaultThreadActionConfigJson() as ThreadActionConfig]
        : [],
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

  public static newComplexThreadConfigList(): PartialDeep<ThreadConfig>[] {
    return [
      {
        actions: [
          {
            name: "thread.storeAsPdfToGDrive",
            args: {
              location: "Folder1/Subfolder1/${thread.firstMessageSubject}",
            },
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
        messages: [
          {
            actions: [
              {
                name: "message.storeAsPdfToGDrive",
                args: { location: "Folder1/Subfolder1/${message.subject}.pdf" },
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
        messages: [
          {
            match: {
              from: "(.+)@example.com",
              subject: "Prefix - (.*) - Suffix(.*)",
              to: "my\\.address\\+(.+)@gmail.com",
              is: [MessageFlag.READ],
              // TODO: Find out how to match only read/unread or starred/unstarred messages?
            },
            actions: [
              // TODO: Decide if only actions of a certain type (thread, message, attachment) are allowed?
              // Pro: More flexible (e.g. forward message, if a certain attachment rule matches)
              { name: "message.markRead" },
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
                    name: "attachment.storeToGDrive",
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

  public static newDefaultConfigJson(): PartialDeep<Config> {
    return {
      settings: this.newDefaultSettingsConfigJson(),
      threads: this.newComplexThreadConfigList(),
    }
  }

  public static newDefaultV1ConfigJson(): PartialDeep<V1Config> {
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

  public static newDefaultConfig(): RequiredConfig {
    return jsonToConfig({
      threads: this.newComplexThreadConfigList(),
    })
  }

  public static newProcessingContextMock(
    envContext = this.newEnvContextMock(),
    config = newConfig() as RequiredConfig,
  ): ProcessingContext {
    return {
      ...envContext,
      proc: {
        gdriveAdapter: new GDriveAdapter(envContext),
        gmailAdapter: new GmailAdapter(envContext),
        spreadsheetAdapter: new SpreadsheetAdapter(envContext),
        config,
        actionRegistry: new ActionRegistry(),
        timer: new Timer(config.settings.maxRuntime),
      },
    }
  }

  public static newThreadContextMock(
    processingContext = this.newProcessingContextMock(),
    thread = this.newThreadMock(),
  ): ThreadContext {
    return {
      ...processingContext,
      thread: {
        config: jsonToThreadConfig(this.newDefaultThreadConfigJson()),
        object: thread,
        configIndex: 0,
        index: 0,
      },
    }
  }

  public static newMessageContextMock(
    threadContext = this.newThreadContextMock(),
    message = this.newMessageMock(),
  ): MessageContext {
    return {
      ...threadContext,
      message: {
        config: newMessageConfig(),
        object: message,
        configIndex: 0,
        index: 0,
      },
    }
  }

  public static newAttachmentContextMock(
    messageContext = this.newMessageContextMock(),
    attachment = this.newAttachmentMock(),
  ): AttachmentContext {
    return {
      ...messageContext,
      attachment: {
        config: newAttachmentConfig(),
        object: attachment,
        configIndex: 0,
        index: 0,
      },
    }
  }

  public static newThreadMock(
    data: Record<string, unknown> = {},
  ): MockProxy<GoogleAppsScript.Gmail.GmailThread> {
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
  ): MockProxy<GoogleAppsScript.Gmail.GmailMessage> {
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
  ): MockProxy<GoogleAppsScript.Gmail.GmailAttachment> {
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
}
