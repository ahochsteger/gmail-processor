import { MockProxy, anyString, matches, mock } from "jest-mock-extended"
import { PartialDeep } from "type-fest"
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

export const fakedSystemTime = "2023-06-26 09:00:00"
jest.useFakeTimers({ now: new Date(fakedSystemTime + "Z") })

class EnvMocks {
  public attachment: MockProxy<GoogleAppsScript.Gmail.GmailAttachment> =
    mock<GoogleAppsScript.Gmail.GmailAttachment>()
  public blob: MockProxy<GoogleAppsScript.Base.Blob> =
    mock<GoogleAppsScript.Base.Blob>()
  public cache: MockProxy<GoogleAppsScript.Cache.Cache> =
    mock<GoogleAppsScript.Cache.Cache>()
  public cacheService: MockProxy<GoogleAppsScript.Cache.CacheService> =
    mock<GoogleAppsScript.Cache.CacheService>()
  public existingFile: MockProxy<GoogleAppsScript.Drive.File> =
    mock<GoogleAppsScript.Drive.File>()
  public newExistingFile: MockProxy<GoogleAppsScript.Drive.File> =
    mock<GoogleAppsScript.Drive.File>()
  public newFile: MockProxy<GoogleAppsScript.Drive.File> =
    mock<GoogleAppsScript.Drive.File>()
  public newNestedFile: MockProxy<GoogleAppsScript.Drive.File> =
    mock<GoogleAppsScript.Drive.File>()
  public existingFolder: MockProxy<GoogleAppsScript.Drive.Folder> =
    mock<GoogleAppsScript.Drive.Folder>()
  public newFolder: MockProxy<GoogleAppsScript.Drive.Folder> =
    mock<GoogleAppsScript.Drive.Folder>()
  public rootFolder: MockProxy<GoogleAppsScript.Drive.Folder> =
    mock<GoogleAppsScript.Drive.Folder>()
  public gdriveApp: MockProxy<GoogleAppsScript.Drive.DriveApp> =
    mock<GoogleAppsScript.Drive.DriveApp>()
  public gmailApp: MockProxy<GoogleAppsScript.Gmail.GmailApp> =
    mock<GoogleAppsScript.Gmail.GmailApp>()
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
}
export class Mocks extends EnvMocks {
  public envContext: EnvContext
  public processingContext: ProcessingContext
  public threadContext: ThreadContext
  public messageContext: MessageContext
  public attachmentContext: AttachmentContext
  constructor(
    configJson: PartialDeep<Config> = ConfigMocks.newDefaultConfigJson(),
    gmailData: GMailData = GMailMocks.getGmailSampleData(),
    dataIndex: IndexType = [0, 0, 0],
    configIndex: IndexType = [0, 0, 0],
    runMode: RunMode = RunMode.DANGEROUS,
  ) {
    const config = newConfig(configJson)
    super()
    // TODO: Move to a better location
    this.cache.get.calledWith(anyString()).mockReturnValue(null)
    this.cache.get
      .calledWith(matches((v) => v === SCRIPT_CACHE_LOGSHEET_ID_KEY))
      .mockReturnValue(LOGSHEET_FILE_ID)
    this.cacheService.getScriptCache.mockReturnValue(this.cache)
    this.blob.getAs.mockReturnValue(this.blob)
    this.blob.getDataAsString.mockReturnValue("PDF-Contents")
    this.user.getEmail.mockReturnValue("my.email@gmail.com")
    this.utilities.newBlob.mockReturnValue(this.blob)
    this.session.getScriptTimeZone.mockReturnValue("UTC")
    this.session.getActiveUser.mockReturnValue(this.user)
    this.session.getEffectiveUser.mockReturnValue(this.user)

    GDriveMocks.setupAllMocks(this)
    GMailMocks.setupAllMocks(this, gmailData, dataIndex)
    SpreadsheetMocks.setupAllMocks(this)

    this.envContext = ContextMocks.newEnvContextMock(this, runMode)
    this.processingContext = ContextMocks.newProcessingContextMock(
      this.envContext,
      config,
    )

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
    config: PartialDeep<Config> = ConfigMocks.newDefaultConfig(),
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
    config: PartialDeep<Config> = ConfigMocks.newDefaultConfig(),
    gmailData: GMailData = GMailMocks.getGmailSampleData(),
    dataIndex: IndexType = [0, 0, 0],
    configIndex: IndexType = [0, 0, 0],
    runMode = RunMode.DANGEROUS,
    mocks = new Mocks(config, gmailData, dataIndex, configIndex, runMode),
  ): Mocks {
    return mocks
  }
}
