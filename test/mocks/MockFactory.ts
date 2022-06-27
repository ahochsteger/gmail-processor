import { Config } from "../../src/config/Config"
import { mock } from "jest-mock-extended"
import { AllActions } from "../../src/actions/AllActions"
import { ProcessingContext } from "../../src/context/ProcessingContext"
import { GmailProcessor } from "../../src/GmailProcessor"
import { ThreadProcessor } from '../../src/processors/ThreadProcessor'
import { GoogleAppsScriptContext } from "../../src/context/GoogleAppsScriptContext"
import { MockObjects } from "./MockObjects"
import { plainToInstance } from "class-transformer"
import { ThreadRule } from "../../src/config/ThreadRule"

export class MockFactory {
  public static newMockObjects() {
    return new MockObjects()
  }

  public static newGasContextMock(md = new MockObjects()) {
    const gasContext: GoogleAppsScriptContext = new GoogleAppsScriptContext(
      md.gmailApp,
      md.gdriveApp,
      md.console,
      md.utilities,
    )
    return gasContext
  }

  public static newDefaultSettingsJson() {
    return {
      // Global filter
      globalFilter: "has:attachment -in:trash -in:drafts -in:spam",
      // Maximum script runtime in seconds (google scripts will be killed after 5 minutes):
      maxRuntime: 280,
      // Only process message newer than (leave empty for no restriction; use d, m and y for day, month and year):
      newerThan: "1m",
      // Gmail label for processed threads (will be created, if not existing):
      processedLabel: "to-gdrive/processed",
      // Sleep time in milli seconds between processed messages:
      sleepTime: 100,
      // Timezone for date/time operations:
      timezone: "GMT",
      threadRules: [],
    }
  }

  public static newDefaultCommandJson() {
    return {
      name: "file.storeToGDrive",
      args: {
        folderType: "path",
        folder: "Folder2/Subfolder2/${message.subject.match.1}",
        filename: "${message.subject} - ${match.file.1}.jpg",
        onExists: "replace",
      }
    }
  }

  public static newDefaultAttachmentRuleJson() {
    return {
      match: {
        name: "Image-([0-9]+)\\.jpg",
        contentType: "image/.+",
      },
      commands: [],
    }
  }

  public static newDefaultThreadRuleJson(): any {
    return {
      filter: "has:attachment from:example@example.com",
      commands: [{
        name: "attachment.storeToGDrive",
        args: { folder: "Folder1/Subfolder1" },
      }],
    }
  }

  public static newComplexThreadRulesJson(): any[] {
    return [
      // Responsible: ThreadProcessor.processRules
      {
        // Responsible: ThreadProcessor.processRule
        description:
          "Example that stores all attachments of all found threads to a certain GDrive folder",
        filter: "has:attachment from:example@example.com",
        commands: [
          // Responsible: ThreadProcessor.performActions
          {
            // Responsible: ThreadProcessor.performAction
            name: "attachment.storeToGDrive",
            args: { location: "Folder1/Subfolder1/${attachment.name}" },
          },
        ],
      },
      {
        // Responsible: ThreadProcessor.processRule
        description:
          "Example that stores all attachments of matching messages to a certain GDrive folder",
        filter: "has:attachment from:example@example.com",
        messagesRules: [
          // Responsible: MessageProcessor.processRules
          {
            // Responsible: MessageProcessor.processRule
            commands: [
              // Responsible: MessageProcessor.performActions
              {
                // Responsible: MessageProcessor.performAction
                name: "attachment.storeToGDrive",
                args: { location: "Folder1/Subfolder1/${attachment.name}" },
              },
            ],
            match: {
              // Responsible: MessageProcessor.matches
              from: "(.+)@example.com",
              subject: "Prefix - (.*) - Suffix(.*)",
              to: "my\\.address\\+(.+)@gmail.com",
            },
          },
        ],
      },
      {
        filter: "has:attachment from:example4@example.com",
        messagesRules: [
          // Responsible: MessageProcessor.processRules
          {
            // Responsible: MessageProcessor.processRule
            match: {
              // Responsible: MessageProcessor.matches
              from: "(.+)@example.com",
              subject: "Prefix - (.*) - Suffix(.*)",
              to: "my\\.address\\+(.+)@gmail.com",
              // TODO: Find out how to match only read/unread or starred/unstarred messages?
            },
            commands: [
              // Responsible: MessageProcessor.performActions
              // TODO: Decide if only actions of a certain type (thread, message, attachment) are allowed?
              // Pro: More flexible (e.g. forward message, if a certain attachment rule matches)
              { name: "markMessageRead" }, // Responsible: MessageProcessor.processAction
            ],
            attachmentRules: [
              // Responsible: AttachmentProcessor.processRules
              {
                // Responsible: AttachmentProcessor.processRule
                match: { name: "Image-([0-9]+)\\.jpg" }, // Responsible: AttachmentProcessor.matches
                commands: [
                  // Responsible: AttachmentProcessor.performActions
                  {
                    // Responsible: AttachmentProcessor.performAction
                    name: "attachment.storeToGDrive",
                    args: {
                      // tslint:disable-next-line: max-line-length
                      location:
                        "Folder2/Subfolder2/${message.subject.match.1}/${email.subject} - ${match.att.1}.jpg",
                      conflictStrategy: "replace",
                    },
                  },
                ],
              },
              {
                match: { name: ".+\\..+" },
                commands: [
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

  public static newDefaultConfig() {
    const cfg = plainToInstance(Config, this.newDefaultSettingsJson())
    cfg.threadRules = plainToInstance(ThreadRule, this.newComplexThreadRulesJson())
    return cfg
  }

  public static newDefaultMailRuleJson() {
    return {
        match: {
            from: "(.+)@example.com",
            subject: "Prefix - (.*) - Suffix(.*)",
            to: "my\\.address\\+(.+)@gmail.com",
        },
        is: [
            "starred",
            "unstarred",
            "read",
            "unread",
        ],
        commands: [],
        attachmentRules: [],
    }
  }

  public static newGmailProcessorMock(config: Config, gasContext = MockFactory.newGasContextMock()) {
    const actionProvider = new AllActions(gasContext, config)
    const threadProcessor = new ThreadProcessor(
      gasContext.gmailApp,
      actionProvider,
      new ProcessingContext(gasContext, config),
    )
    const gmailProcessor = new GmailProcessor(
      gasContext,
      config,
      actionProvider,
      threadProcessor,
    )
    gmailProcessor.setLogger(gasContext.logger)
    return gmailProcessor
  }

  public static newThreadMock(
    data: any = {},
  ): GoogleAppsScript.Gmail.GmailThread {
    data = MockFactory.getThreadSampleData(data)
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
      MockFactory.getMessages(data),
    )
    return mockedGmailThread
  }
  public static newMessageMock(
    data: any = {},
  ): GoogleAppsScript.Gmail.GmailMessage {
    data = MockFactory.getMessageSampleData(data)
    data.attachments = data.attachments ? data.attachments : [] // Make sure attachments is defined
    const mockedGmailMessage = mock<GoogleAppsScript.Gmail.GmailMessage>()
    mockedGmailMessage.getAttachments.mockReturnValue(
      MockFactory.getAttachments(data),
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
    data = MockFactory.getAttachmentSampleData(data)
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
      a[i] = MockFactory.newMessageMock(data.messages[i])
    }
    return a
  }
  private static getAttachments(
    data: any,
  ): GoogleAppsScript.Gmail.GmailAttachment[] {
    const a = []
    for (let i = 0; i < data.attachments.length; i++) {
      a[i] = MockFactory.newAttachmentMock(data.attachments[i])
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
      MockFactory.getMessageSampleData(
        data.messages && data.messages.length > 0 ? data.messages[0] : {},
      ),
      MockFactory.getMessageSampleData(
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
      size: MockFactory.lengthInUtf8Bytes(sampleContent),
      isGoogleType: false,
      content: sampleContent,
    }
    Object.assign(sampleData, data)
    return sampleData
  }
}
