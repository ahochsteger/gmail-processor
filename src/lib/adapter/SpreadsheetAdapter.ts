import { EnvContext } from "../Context"
import { BaseAdapter } from "./BaseAdapter"
import { DriveUtils } from "./GDriveAdapter"

export const SCRIPT_CACHE_LOGSHEET_ID_KEY = "logSheetId"

// TODO: Re-use substitution maps for logsheet data
export class SpreadsheetAdapter extends BaseAdapter {
  private spreadsheetApp: GoogleAppsScript.Spreadsheet.SpreadsheetApp
  private driveApp: GoogleAppsScript.Drive.DriveApp
  private cacheService: GoogleAppsScript.Cache.CacheService
  private logSheetId: string | null = null
  private logSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet | null = null
  private logSheet: GoogleAppsScript.Spreadsheet.Sheet | null = null
  constructor(public ctx: EnvContext) {
    super(ctx)
    this.spreadsheetApp = ctx.env.spreadsheetApp
    this.driveApp = ctx.env.gdriveApp
    this.cacheService = ctx.env.cacheService
    this.logSheetId = this.cacheService
      .getScriptCache()
      .get(SCRIPT_CACHE_LOGSHEET_ID_KEY)
  }

  private createLogSheet(
    location: string,
  ): GoogleAppsScript.Spreadsheet.Sheet | null {
    const locInfo = DriveUtils.extractLocationInfo(location)
    const folder = DriveUtils.ensureFolderExists(this.ctx, location)
    this.logSpreadsheet = this.spreadsheetApp.create(locInfo.filename)
    this.logSheetId = this.logSpreadsheet.getId()
    this.cacheService
      .getScriptCache()
      .put(SCRIPT_CACHE_LOGSHEET_ID_KEY, this.logSheetId)
    const logSheetFile = this.driveApp.getFileById(this.logSheetId)
    logSheetFile.moveTo(folder)
    console.info(`Created new logSheet at: ${logSheetFile.getUrl()}`)
    this.appendToLogSheet(
      "Mail title",
      "Mail date",
      "Mail id",
      "Mail link",
      "File Origine",
      "File Name",
      "File Link",
    )
    return this.logSheet
  }

  private appendToLogSheet(...args: unknown[]) {
    const values = [args]
    const logSheet = this.getLogSheet()
    if (!logSheet) {
      console.error(`Could not open logSheet! Could not log: ${args}`)
      return
    }
    const lastRow = logSheet.getLastRow() + 1
    logSheet.getRange(lastRow, args.length, 1, args.length).setValues(values)
  }

  // // TODO: Consolidate with folder logic from GDriveAdapter
  // private getOrCreateFolder(
  //   path: string,
  //   parentFolderId = "",
  // ): GoogleAppsScript.Drive.Folder {
  //   const parts = path.split("/")
  //   if (parts[0] === "") {
  //     parts.shift()
  //   }

  //   let folder = parentFolderId
  //     ? this.driveApp.getFolderById(parentFolderId)
  //     : this.driveApp.getRootFolder()
  //   for (const subfolder of parts) {
  //     let nextFolder = null
  //     const folders = folder.getFolders()
  //     while (folders.hasNext()) {
  //       const f = folders.next()
  //       if (f.getName() === subfolder) {
  //         nextFolder = f
  //         break
  //       }
  //     }
  //     folder = nextFolder || folder.createFolder(subfolder)
  //   }
  //   return folder
  // }

  private getLogSheet(): GoogleAppsScript.Spreadsheet.Sheet | null {
    if (this.logSheet) return this.logSheet
    if (this.logSheetId) {
      this.logSpreadsheet = this.spreadsheetApp.openById(this.logSheetId)
      this.logSheet = this.logSpreadsheet.getSheets()[0]
      return this.logSheet
    }
    return null
  }

  public initLogSheet(location: string, ...args: unknown[]) {
    this.createLogSheet(location)
    this.appendToLogSheet(...args)
  }

  public logAttachmentStored(
    message: GoogleAppsScript.Gmail.GmailMessage,
    attachment: GoogleAppsScript.Gmail.GmailAttachment,
    location: string,
    file: GoogleAppsScript.Drive.File,
  ) {
    console.info(
      `Creating spreadsheet log entry for attachment '${attachment.getName()}' of message '${message.getSubject()}' stored to ${location} (${file.getName()}) ...`,
    )
    this.appendToLogSheet(
      message.getSubject(),
      message.getDate(),
      message.getId(),
      `https://mail.google.com/mail/u/0/#inbox/${message.getId()}`,
      "Attachment",
      file.getName(),
      file.getUrl(),
    )
  }

  public logAttachmentInfo(
    message: GoogleAppsScript.Gmail.GmailMessage,
    attachment: GoogleAppsScript.Gmail.GmailAttachment,
    location: string,
    logMessage: string,
  ) {
    console.info(
      `Creating spreadsheet log entry for attachment '${attachment.getName()}' of message '${message.getSubject()}' stored to ${location} ...`,
    )
    this.appendToLogSheet(
      message.getSubject(),
      message.getDate(),
      message.getId(),
      `https://mail.google.com/mail/u/0/#inbox/${message.getId()}`,
      "Attachment",
      attachment.getName(),
      logMessage,
    )
  }

  public log(logMessage: string) {
    console.info(`Creating spreadsheet log entry: '${logMessage}' ...`)
    this.appendToLogSheet("", "", "", "", "", "", logMessage)
  }

  public logMessagePdf(
    message: GoogleAppsScript.Gmail.GmailMessage,
    location: string,
    pdf: GoogleAppsScript.Drive.File,
  ) {
    console.info(
      `Creating spreadsheet log entry for PDF export of message '${message.getSubject()}' stored to ${location} ...`,
    )
    this.appendToLogSheet(
      message.getSubject(),
      message.getDate(),
      message.getId(),
      `https://mail.google.com/mail/u/0/#inbox/${message.getId()}`,
      "Thread",
      pdf.getName(),
      pdf.getUrl(),
    )
  }

  public logThreadPdf(
    thread: GoogleAppsScript.Gmail.GmailThread,
    location: string,
    pdf: GoogleAppsScript.Drive.File,
  ) {
    console.info(
      `Creating spreadsheet log entry for PDF export of thread '${thread.getFirstMessageSubject()}' stored to ${location} ...`,
    )
    this.appendToLogSheet(
      thread.getFirstMessageSubject(),
      thread.getLastMessageDate(),
      thread.getId(),
      `https://mail.google.com/mail/u/0/#inbox/${thread.getId()}`,
      "Thread",
      pdf.getName(),
      pdf.getUrl(),
    )
  }
}
