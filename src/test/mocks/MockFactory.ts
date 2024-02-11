import { MockProxy, any, matches, mock } from "jest-mock-extended"
import {
  AttachmentContext,
  EnvContext,
  MessageContext,
  ProcessingContext,
  RunMode,
  ThreadContext,
} from "../../lib/Context"
import { SCRIPT_CACHE_LOGSHEET_ID_KEY } from "../../lib/adapter/SpreadsheetAdapter"
import { Config, newConfig } from "../../lib/config/Config"
import { ConfigMocks } from "./ConfigMocks"
import { ContextMocks } from "./ContextMocks"
import { GDriveMocks, LOGSHEET_FILE_ID } from "./GDriveMocks"
import { GMailData, GMailMocks, IndexType } from "./GMailMocks"
import { SpreadsheetMocks } from "./SpreadsheetMocks"

export const fakedSystemDateString = "2023-06-26" // Automated tests rely on this date to be a monday!
export const fakedSystemTimeString = "09:00:00" // TODO: Use "12:34:56.789" instead to better test date-fns functions
export const fakedSystemDateTimeString = `${fakedSystemDateString} ${fakedSystemTimeString}`
export const fakedSystemDateTime = new Date(
  `${fakedSystemDateString}T${fakedSystemTimeString}`,
)
jest.useFakeTimers({ now: fakedSystemDateTime })

class EnvMocks {
  public attachment: MockProxy<GoogleAppsScript.Gmail.GmailAttachment> =
    mock<GoogleAppsScript.Gmail.GmailAttachment>()
  public cache: MockProxy<GoogleAppsScript.Cache.Cache> =
    mock<GoogleAppsScript.Cache.Cache>()
  public cacheService: MockProxy<GoogleAppsScript.Cache.CacheService> =
    mock<GoogleAppsScript.Cache.CacheService>()
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
  public urlResponse: MockProxy<GoogleAppsScript.URL_Fetch.HTTPResponse> =
    mock<GoogleAppsScript.URL_Fetch.HTTPResponse>()

  constructor() {
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
      .mockReturnValue("UTC")
      .mockName("getScriptTimeZone")
    this.session.getActiveUser
      .mockReturnValue(this.user)
      .mockName("getActiveUser")
    this.session.getEffectiveUser
      .mockReturnValue(this.user)
      .mockName("getEffectiveUser")
  }
}
export class Mocks extends EnvMocks {
  public envContext: EnvContext
  public processingContext: ProcessingContext
  public threadContext: ThreadContext
  public messageContext: MessageContext
  public attachmentContext: AttachmentContext
  constructor(
    configJson: Config = ConfigMocks.newDefaultConfigJson(),
    gmailData: GMailData = GMailMocks.getGmailSampleData(),
    dataIndex: IndexType = [0, 0, 0],
    configIndex: IndexType = [0, 0, 0],
    runMode: RunMode = RunMode.DANGEROUS,
  ) {
    super()

    this.envContext = ContextMocks.newEnvContextMock(this, runMode)
    GDriveMocks.setupAllMocks(this)
    GMailMocks.setupAllMocks(this, gmailData, dataIndex)
    SpreadsheetMocks.setupAllMocks(this)
    const config = newConfig(configJson)
    this.processingContext = ContextMocks.newProcessingContextMock(
      this.envContext,
      config,
    )

    // Setup special mocks:
    this.urlFetchApp.fetch.mockReturnValue(this.urlResponse)
    this.urlResponse.getBlob.mockReturnValue(this.newBlob)
    this.attachment.copyBlob.mockReturnValue(this.newBlob)

    const [threadIndex, messageIndex, attachmentIndex] = dataIndex
    const [threadConfigIndex, messageConfigIndex, attachmentConfigIndex] =
      configIndex

    this.threadContext = ContextMocks.newThreadContextMock(
      this.processingContext,
      this.thread,
      threadIndex,
      threadConfigIndex,
    )
    this.messageContext = ContextMocks.newMessageContextMock(
      this.threadContext,
      this.message,
      messageIndex,
      messageConfigIndex,
    )
    this.attachmentContext = ContextMocks.newAttachmentContextMock(
      this.messageContext,
      this.attachment,
      attachmentIndex,
      attachmentConfigIndex,
    )
  }
}

export class MockFactory {
  public static newMocks(
    config: Config = ConfigMocks.newDefaultConfig(),
    runMode = RunMode.DANGEROUS,
    mocks = new Mocks(
      config,
      GMailMocks.getGmailSampleData(),
      [0, 0, 0],
      [0, 0, 0],
      runMode,
    ),
  ): Mocks {
    return mocks
  }
  public static newCustomMocks(
    config: Config = ConfigMocks.newDefaultConfig(),
    gmailData: GMailData = GMailMocks.getGmailSampleData(),
    dataIndex: IndexType = [0, 0, 0],
    configIndex: IndexType = [0, 0, 0],
    runMode = RunMode.DANGEROUS,
    mocks = new Mocks(config, gmailData, dataIndex, configIndex, runMode),
  ): Mocks {
    return mocks
  }
}
