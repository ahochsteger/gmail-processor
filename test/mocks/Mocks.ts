import { ProcessingContext } from "../../src/context/ProcessingContext"
import { Config } from "../../src/config/Config"
import { GoogleAppsScriptContext } from "../../src/context/GoogleAppsScriptContext"
import { mock } from "jest-mock-extended"
import { ThreadConfig } from "../../src/config/ThreadConfig"
import { ThreadContext } from "../../src/context/ThreadContext"
import { ThreadActions } from "../../src/actions/ThreadActions"
import { MessageContext } from "../../src/context/MessageContext"
import { MessageConfig } from "../../src/config/MessageConfig"
import { MessageActions } from "../../src/actions/MessageActions"
import { AttachmentActions } from "../../src/actions/AttachmentActions"
import { AttachmentContext } from "../../src/context/AttachmentContext"
import { AttachmentConfig } from "../../src/config/AttachmentConfig"

export class Mocks {
  // Create Google Apps Script Context mock objects:
  public gasContext: GoogleAppsScriptContext
  public gmailApp = mock<GoogleAppsScript.Gmail.GmailApp>()
  public gdriveApp = mock<GoogleAppsScript.Drive.DriveApp>()
  public spreadsheetApp = mock<GoogleAppsScript.Spreadsheet.SpreadsheetApp>()
  public cacheService = mock<GoogleAppsScript.Cache.CacheService>()
  public utilities = mock<GoogleAppsScript.Utilities.Utilities>()
  public processingContext: ProcessingContext

  // Objects for behavior mocking:
  public thread = mock<GoogleAppsScript.Gmail.GmailThread>()
  public threadContext: ThreadContext
  public threadActions: ThreadActions
  public message = mock<GoogleAppsScript.Gmail.GmailMessage>()
  public messageContext: MessageContext
  public messageActions: MessageActions
  public attachment = mock<GoogleAppsScript.Gmail.GmailAttachment>()
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
    this.thread.getMessages.mockReturnValue([this.message])
    this.thread.markImportant.mockReturnValue(this.thread)
    this.message.forward.mockReturnValue(this.message)
    this.folder.getFilesByName.mockReturnValue(this.fileIterator)
    this.folder.createFile.mockReturnValue(this.file)
    this.gdriveApp.getRootFolder.mockReturnValue(this.folder)
    this.gdriveApp.getFoldersByName.mockReturnValue(this.folderIterator)
    this.cache.get.mockReturnValue("some-id")
    this.cacheService.getScriptCache.mockReturnValue(this.cache)
    this.gasContext = new GoogleAppsScriptContext(
      this.gmailApp,
      this.gdriveApp,
      this.utilities,
      this.spreadsheetApp,
      this.cacheService,
    )
    this.processingContext = new ProcessingContext(
      this.gasContext,
      config,
      dryRun,
    )
    this.threadContext = new ThreadContext(
      this.processingContext,
      new ThreadConfig(),
      this.thread,
    )
    this.threadActions = new ThreadActions(this.threadContext)
    this.messageContext = new MessageContext(
      this.threadContext,
      new MessageConfig(),
      this.message,
    )
    this.messageActions = new MessageActions(this.messageContext)
    this.attachmentContext = new AttachmentContext(
      this.messageContext,
      new AttachmentConfig(),
      this.attachment,
    )
    this.attachmentActions = new AttachmentActions(this.attachmentContext)
    this.blob.getAs.mockReturnValue(this.blob)
    this.blob.getDataAsString.mockReturnValue("PDF-Contents")
    this.utilities.newBlob.mockReturnValue(this.blob)
  }
}
