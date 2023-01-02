import { GDriveAdapter } from "../adapter/GDriveAdapter";
import { GmailAdapter } from "../adapter/GmailAdapter";

export class GoogleAppsScriptContext {
  public gmailAdapter: GmailAdapter
  public gdriveAdapter: GDriveAdapter
  constructor(
    public gmailApp: GoogleAppsScript.Gmail.GmailApp,
    public gdriveApp: GoogleAppsScript.Drive.DriveApp,
    public logger: Console,
    public utilities: GoogleAppsScript.Utilities.Utilities,
    public dryRun: boolean,
  ) {
    this.gmailAdapter = new GmailAdapter(logger, dryRun, gmailApp)
    this.gdriveAdapter = new GDriveAdapter(logger, dryRun, gdriveApp)
  }
}
