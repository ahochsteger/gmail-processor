import { ActionRegistry } from "../actions/ActionRegistry"
import { GDriveAdapter } from "../adapter/GDriveAdapter"
import { GmailAdapter } from "../adapter/GmailAdapter"
import { SpreadsheetAdapter } from "../adapter/SpreadsheetAdapter"
import { Config } from "../config/Config"
import { GoogleAppsScriptContext } from "./GoogleAppsScriptContext"

export class ProcessingContext {
  public gmailAdapter: GmailAdapter
  public gdriveAdapter: GDriveAdapter
  public spreadsheetAdapter: SpreadsheetAdapter
  public actionRegistry: ActionRegistry
  constructor(
    public gasContext: GoogleAppsScriptContext,
    public config: Config,
    public dryRun = false,
  ) {
    this.gmailAdapter = new GmailAdapter(this)
    this.gdriveAdapter = new GDriveAdapter(this)
    this.spreadsheetAdapter = new SpreadsheetAdapter(this)
    this.actionRegistry = new ActionRegistry()
  }
}
