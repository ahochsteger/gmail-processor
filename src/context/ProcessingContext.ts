import { GDriveAdapter } from "../adapter/GDriveAdapter"
import { GmailAdapter } from "../adapter/GmailAdapter"
import { Config } from "../config/Config"
import { GoogleAppsScriptContext } from "./GoogleAppsScriptContext"

export class ProcessingContext {
  public gmailAdapter: GmailAdapter
  public gdriveAdapter: GDriveAdapter
  constructor(
    public gasContext: GoogleAppsScriptContext,
    public config: Config,
    public dryRun = false,
  ) {
    this.gmailAdapter = new GmailAdapter(this)
    this.gdriveAdapter = new GDriveAdapter(this)
  }
}
