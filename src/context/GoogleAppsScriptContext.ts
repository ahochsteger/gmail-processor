export class GoogleAppsScriptContext {
constructor(
    public gmailApp: GoogleAppsScript.Gmail.GmailApp,
    public gdriveApp: GoogleAppsScript.Drive.DriveApp,
    public logger: Console,
    public utilities: GoogleAppsScript.Utilities.Utilities,
  ) {}
}
