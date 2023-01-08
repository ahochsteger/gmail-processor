import { mock } from "jest-mock-extended"

export class MockObjects {
  public console = mock<Console>()
  public gmailApp = mock<GoogleAppsScript.Gmail.GmailApp>()
  public gdriveApp = mock<GoogleAppsScript.Drive.DriveApp>()
  public spreadsheetApp = mock<GoogleAppsScript.Spreadsheet.SpreadsheetApp>()
  public cacheService = mock<GoogleAppsScript.Cache.CacheService>()
  public utilities = mock<GoogleAppsScript.Utilities.Utilities>()
  public folder = mock<GoogleAppsScript.Drive.Folder>()
  public file = mock<GoogleAppsScript.Drive.File>()
  constructor() {
    this.folder.getFilesByName.mockReturnValue(
      mock<GoogleAppsScript.Drive.FileIterator>(),
    )
    this.folder.createFile.mockReturnValue(this.file)
    this.gdriveApp.getRootFolder.mockReturnValue(this.folder)
    this.gdriveApp.getFilesByName.mockReturnValue(
      mock<GoogleAppsScript.Drive.FileIterator>(),
    )
    this.gdriveApp.getFoldersByName.mockReturnValue(
      mock<GoogleAppsScript.Drive.FolderIterator>(),
    )
  }
}
