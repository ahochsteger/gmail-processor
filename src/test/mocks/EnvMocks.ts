import { MockProxy, any, matches, mock } from "jest-mock-extended"
import { SCRIPT_CACHE_LOGSHEET_ID_KEY } from "../../lib/adapter/SpreadsheetAdapter"
import { LOGSHEET_FILE_ID } from "./GDriveMocks"

export class EnvMocks {
  public attachment: MockProxy<GoogleAppsScript.Gmail.GmailAttachment> =
    mock<GoogleAppsScript.Gmail.GmailAttachment>()
  public cache: MockProxy<GoogleAppsScript.Cache.Cache> =
    mock<GoogleAppsScript.Cache.Cache>()
  public cacheService: MockProxy<GoogleAppsScript.Cache.CacheService> =
    mock<GoogleAppsScript.Cache.CacheService>()
  public documentApp: MockProxy<GoogleAppsScript.Document.DocumentApp> =
    mock<GoogleAppsScript.Document.DocumentApp>()
  public driveApi: MockProxy<GoogleAppsScript.Drive> =
    mock<GoogleAppsScript.Drive>()
  public existingBlob: MockProxy<GoogleAppsScript.Base.Blob> =
    mock<GoogleAppsScript.Base.Blob>()
  public existingFile: MockProxy<GoogleAppsScript.Drive.File> =
    mock<GoogleAppsScript.Drive.File>()
  public genericNewBlob: MockProxy<GoogleAppsScript.Base.Blob> =
    mock<GoogleAppsScript.Base.Blob>()
  public genericNewFile: MockProxy<GoogleAppsScript.Drive.File> =
    mock<GoogleAppsScript.Drive.File>()
  public genericNewFolder: MockProxy<GoogleAppsScript.Drive.Folder> =
    mock<GoogleAppsScript.Drive.Folder>()
  public newDocsBlob: MockProxy<GoogleAppsScript.Base.Blob> =
    mock<GoogleAppsScript.Base.Blob>()
  public newDocsFile: MockProxy<GoogleAppsScript.Drive.File> =
    mock<GoogleAppsScript.Drive.File>()
  public newExistingBlob: MockProxy<GoogleAppsScript.Base.Blob> =
    mock<GoogleAppsScript.Base.Blob>()
  public newExistingFile: MockProxy<GoogleAppsScript.Drive.File> =
    mock<GoogleAppsScript.Drive.File>()
  public newBlob: MockProxy<GoogleAppsScript.Base.Blob> =
    mock<GoogleAppsScript.Base.Blob>()
  public newFile: MockProxy<GoogleAppsScript.Drive.File> =
    mock<GoogleAppsScript.Drive.File>()
  public newHtmlBlob: MockProxy<GoogleAppsScript.Base.Blob> =
    mock<GoogleAppsScript.Base.Blob>()
  public newHtmlFile: MockProxy<GoogleAppsScript.Drive.File> =
    mock<GoogleAppsScript.Drive.File>()
  public newNestedBlob: MockProxy<GoogleAppsScript.Base.Blob> =
    mock<GoogleAppsScript.Base.Blob>()
  public newNestedFile: MockProxy<GoogleAppsScript.Drive.File> =
    mock<GoogleAppsScript.Drive.File>()
  public newPdfBlob: MockProxy<GoogleAppsScript.Base.Blob> =
    mock<GoogleAppsScript.Base.Blob>()
  public newPdfFile: MockProxy<GoogleAppsScript.Drive.File> =
    mock<GoogleAppsScript.Drive.File>()
  public e2eBaseFolder: MockProxy<GoogleAppsScript.Drive.Folder> =
    mock<GoogleAppsScript.Drive.Folder>()
  public e2eTestFolder: MockProxy<GoogleAppsScript.Drive.Folder> =
    mock<GoogleAppsScript.Drive.Folder>()
  public existingFolder: MockProxy<GoogleAppsScript.Drive.Folder> =
    mock<GoogleAppsScript.Drive.Folder>()
  public newFolder: MockProxy<GoogleAppsScript.Drive.Folder> =
    mock<GoogleAppsScript.Drive.Folder>()
  public newNestedFolder: MockProxy<GoogleAppsScript.Drive.Folder> =
    mock<GoogleAppsScript.Drive.Folder>()
  public rootFolder: MockProxy<GoogleAppsScript.Drive.Folder> =
    mock<GoogleAppsScript.Drive.Folder>()
  public gdriveApp: MockProxy<GoogleAppsScript.Drive.DriveApp> =
    mock<GoogleAppsScript.Drive.DriveApp>()
  public gmailApp: MockProxy<GoogleAppsScript.Gmail.GmailApp> =
    mock<GoogleAppsScript.Gmail.GmailApp>()
  public mailApp: MockProxy<GoogleAppsScript.Mail.MailApp> =
    mock<GoogleAppsScript.Mail.MailApp>()
  public message: MockProxy<GoogleAppsScript.Gmail.GmailMessage> =
    mock<GoogleAppsScript.Gmail.GmailMessage>()
  public spreadsheetApp: MockProxy<GoogleAppsScript.Spreadsheet.SpreadsheetApp> =
    mock<GoogleAppsScript.Spreadsheet.SpreadsheetApp>()
  public logSheetRange: MockProxy<GoogleAppsScript.Spreadsheet.Range> =
    mock<GoogleAppsScript.Spreadsheet.Range>()
  public logSheet: MockProxy<GoogleAppsScript.Spreadsheet.Sheet> =
    mock<GoogleAppsScript.Spreadsheet.Sheet>()
  public logSpreadsheet: MockProxy<GoogleAppsScript.Spreadsheet.Spreadsheet> =
    mock<GoogleAppsScript.Spreadsheet.Spreadsheet>()
  public logSpreadsheetBlob: MockProxy<GoogleAppsScript.Base.Blob> =
    mock<GoogleAppsScript.Base.Blob>()
  public logSpreadsheetFile: MockProxy<GoogleAppsScript.Drive.File> =
    mock<GoogleAppsScript.Drive.File>()
  public session: MockProxy<GoogleAppsScript.Base.Session> =
    mock<GoogleAppsScript.Base.Session>()
  public thread: MockProxy<GoogleAppsScript.Gmail.GmailThread> =
    mock<GoogleAppsScript.Gmail.GmailThread>()
  public user: MockProxy<GoogleAppsScript.Base.User> =
    mock<GoogleAppsScript.Base.User>()
  public utilities: MockProxy<GoogleAppsScript.Utilities.Utilities> =
    mock<GoogleAppsScript.Utilities.Utilities>()
  public urlFetchApp: MockProxy<GoogleAppsScript.URL_Fetch.UrlFetchApp> =
    mock<GoogleAppsScript.URL_Fetch.UrlFetchApp>()
  public propertiesService: MockProxy<GoogleAppsScript.Properties.PropertiesService> =
    mock<GoogleAppsScript.Properties.PropertiesService>()
  public scriptProperties: MockProxy<GoogleAppsScript.Properties.Properties> =
    mock<GoogleAppsScript.Properties.Properties>()
  public urlResponse: MockProxy<GoogleAppsScript.URL_Fetch.HTTPResponse> =
    mock<GoogleAppsScript.URL_Fetch.HTTPResponse>()

  constructor() {
    this.propertiesService.getScriptProperties.mockReturnValue(
      this.scriptProperties,
    )
    this.cache.get
      .calledWith(matches((v) => v !== SCRIPT_CACHE_LOGSHEET_ID_KEY))
      .mockReturnValue(null)
      .mockName("getScriptCache-null")
    this.cache.get
      .calledWith(matches((v) => v === SCRIPT_CACHE_LOGSHEET_ID_KEY))
      .mockReturnValue(LOGSHEET_FILE_ID)
      .mockName("getScriptCache-logsheet-file-id")
    this.cacheService.getScriptCache
      .mockReturnValue(this.cache)
      .mockName("getScriptCache")
    this.user.getEmail
      .mockReturnValue("my.email@gmail.com")
      .mockName("getEmail")
    this.utilities.getUuid.mockReturnValue("mock-uuid").mockName("getUuid")
    this.utilities.DigestAlgorithm = {
      MD5: 0,
      SHA_1: 1,
      SHA_256: 2,
      SHA_384: 3,
      SHA_512: 4,
    } as any
    this.utilities.computeDigest
      .mockReturnValue([0xab, 0xcd, 0xef, 0x12, 0x34, 0x56, 0x78, 0x90])
      .mockName("computeDigest")
    this.utilities.newBlob
      .calledWith(
        any(),
        matches((v) => v !== "text/html" && v !== "application/pdf"),
        any(),
      )
      .mockReturnValue(this.newBlob)
      .mockName("newBlob")
    this.utilities.newBlob
      .calledWith(
        any(),
        matches((v) => v === "text/html"),
        any(),
      )
      .mockReturnValue(this.newHtmlBlob)
      .mockName("newHtmlBlob")
    this.utilities.newBlob
      .calledWith(
        any(),
        matches((v) => v === "application/pdf"),
        any(),
      )
      .mockReturnValue(this.newPdfBlob)
      .mockName("newPdfBlob")
    this.session.getScriptTimeZone
      .mockReturnValue("Etc/UTC")
      .mockName("getScriptTimeZone")
    this.session.getActiveUser
      .mockReturnValue(this.user)
      .mockName("getActiveUser")
    this.session.getEffectiveUser
      .mockReturnValue(this.user)
      .mockName("getEffectiveUser")
  }
}
