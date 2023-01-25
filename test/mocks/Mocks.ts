import { ProcessingContext } from "../../src/context/ProcessingContext"
import { Config } from "../../src/config/Config"
import { GoogleAppsScriptContext } from "../../src/context/GoogleAppsScriptContext"
import { mock } from "jest-mock-extended"

export class Mocks {
  // Create Google Apps Script Context mock objects:
  public gasContext: GoogleAppsScriptContext
  public console = mock<Console>()
  public gmailApp = mock<GoogleAppsScript.Gmail.GmailApp>()
  public gdriveApp = mock<GoogleAppsScript.Drive.DriveApp>()
  public spreadsheetApp = mock<GoogleAppsScript.Spreadsheet.SpreadsheetApp>()
  public cacheService = mock<GoogleAppsScript.Cache.CacheService>()
  public utilities = mock<GoogleAppsScript.Utilities.Utilities>()
  public processingContext: ProcessingContext

  // Objects for behavior mocking:
  public thread = mock<GoogleAppsScript.Gmail.GmailThread>()
  public message = mock<GoogleAppsScript.Gmail.GmailMessage>()
  public attachment = mock<GoogleAppsScript.Gmail.GmailAttachment>()
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
      this.console,
      this.utilities,
      this.spreadsheetApp,
      this.cacheService,
    )
    this.processingContext = new ProcessingContext(
      this.gasContext,
      config,
      dryRun,
    )
    this.blob.getAs.mockReturnValue(this.blob)
    this.blob.getDataAsString.mockReturnValue("PDF-Contents")
    this.utilities.newBlob.mockReturnValue(this.blob)
  }
}
