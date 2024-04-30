import {
  AttachmentContext,
  EnvContext,
  MessageContext,
  ProcessingContext,
  ThreadContext,
} from "../Context"
import { SettingsConfig } from "../config/SettingsConfig"
import { LogLevel } from "../utils/Logger"
import { PatternUtil } from "../utils/PatternUtil"
import { BaseAdapter } from "./BaseAdapter"
import { DriveUtils } from "./GDriveAdapter"
import { LogAdapter } from "./LogAdapter"

export const SCRIPT_CACHE_LOGSHEET_ID_KEY = "GmailProcessor.logSheetId"

export class SpreadsheetAdapter extends BaseAdapter {
  private spreadsheetApp: GoogleAppsScript.Spreadsheet.SpreadsheetApp
  private driveApp: GoogleAppsScript.Drive.DriveApp
  private cacheService: GoogleAppsScript.Cache.CacheService
  private logSheetId: string | null = null
  private logSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet | null = null
  private logSheet: GoogleAppsScript.Spreadsheet.Sheet | null = null
  constructor(
    public ctx: EnvContext,
    public settings: SettingsConfig,
    public logAdapter: LogAdapter,
  ) {
    super(ctx, settings)
    this.logAdapter = logAdapter
    this.spreadsheetApp = ctx.env.spreadsheetApp
    this.driveApp = ctx.env.gdriveApp
    this.cacheService = ctx.env.cacheService
    // TODO: Check if of any help here at all
    this.logSheetId = this.cacheService
      .getScriptCache()
      .get(SCRIPT_CACHE_LOGSHEET_ID_KEY)
    if (this.logSheetEnabled()) {
      this.initLogSheet()
    }
  }

  private createLogSheet(
    location: string,
  ): GoogleAppsScript.Spreadsheet.Sheet | null {
    const { existingFiles, locationInfo } = DriveUtils.findFilesByLocation(
      this.ctx,
      location,
    )
    let logSheetFile
    if (existingFiles.hasNext()) {
      logSheetFile = existingFiles.next()
      this.ctx.log.info(`Found existing logSheet at: ${logSheetFile.getUrl()}`)
      this.logSheetId = logSheetFile.getId()
      this.logSpreadsheet = this.spreadsheetApp.openById(this.logSheetId)
    } else {
      const folder = DriveUtils.ensureFolderExists(this.ctx, location)
      this.logSpreadsheet = this.spreadsheetApp.create(locationInfo.filename)
      this.logSheetId = this.logSpreadsheet.getId()
      logSheetFile = this.driveApp.getFileById(this.logSheetId)
      logSheetFile.moveTo(folder)
      this.ctx.log.info(`Created new logSheet at: ${logSheetFile.getUrl()}`)
      this.appendToLogSheet(...this.logAdapter.getLogHeaders(this.ctx))
    }
    this.cacheService
      .getScriptCache()
      .put(SCRIPT_CACHE_LOGSHEET_ID_KEY, this.logSheetId)
    return this.logSheet
  }

  private appendToLogSheet(...args: unknown[]) {
    const logSheet = this.getLogSheet()
    if (!logSheet) {
      this.ctx.log.error(`Could not open logSheet! Could not log: ${args}`)
      return
    }
    this.ctx.log.debug(`Appending to logSheet: ${JSON.stringify(args)}`)
    logSheet.appendRow(args)
  }

  private getLogSheet(): GoogleAppsScript.Spreadsheet.Sheet | null {
    if (this.logSheet) return this.logSheet
    if (this.logSheetId) {
      this.logSpreadsheet = this.spreadsheetApp.openById(this.logSheetId)
      this.logSheet = this.logSpreadsheet.getSheets()[0]
      return this.logSheet
    }
    return null
  }

  private logSheetEnabled() {
    return !!this.settings.logSheetLocation
  }

  public initLogSheet(...args: unknown[]) {
    if (this.settings.logSheetLocation) {
      const location = PatternUtil.substitute(
        this.ctx,
        this.settings.logSheetLocation,
      )
      this.createLogSheet(location)
      if (args.length > 0) {
        this.appendToLogSheet(...args)
      }
    }
  }

  public log(
    ctx: ProcessingContext | ThreadContext | MessageContext | AttachmentContext,
    message: string,
    level: LogLevel = LogLevel.INFO,
  ) {
    if (!this.logSheetEnabled()) {
      this.ctx.log.warn(`Skipping Logsheet: ${message}`, level)
      return
    }
    ctx.log.log(`Logsheet: ${message}`, level)
    const logValues = this.logAdapter.getLogValues(ctx, message, level)
    this.appendToLogSheet(...logValues)
  }
}
