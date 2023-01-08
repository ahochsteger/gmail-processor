export class GoogleAppsScriptContext {
  constructor(
    // TODO: Reorder (e.g. logger, utilities first)
    public gmailApp: GoogleAppsScript.Gmail.GmailApp,
    public gdriveApp: GoogleAppsScript.Drive.DriveApp,
    public logger: Console,
    public utilities: GoogleAppsScript.Utilities.Utilities,
    public spreadsheetApp: GoogleAppsScript.Spreadsheet.SpreadsheetApp,
    public cacheService: GoogleAppsScript.Cache.CacheService,
  ) {}
}
