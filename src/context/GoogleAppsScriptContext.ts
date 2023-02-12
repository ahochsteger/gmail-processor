export class GoogleAppsScriptContext {
  constructor(
    public gmailApp: GoogleAppsScript.Gmail.GmailApp,
    public gdriveApp: GoogleAppsScript.Drive.DriveApp,
    public utilities: GoogleAppsScript.Utilities.Utilities,
    public spreadsheetApp: GoogleAppsScript.Spreadsheet.SpreadsheetApp,
    public cacheService: GoogleAppsScript.Cache.CacheService,
  ) {}
}
