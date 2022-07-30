import { Config } from "../config/Config"
import { GoogleAppsScriptContext } from "../context/GoogleAppsScriptContext"
import { Action } from "./Action"
import { ActionProvider } from "./ActionProvider"
import { Actions } from "./Actions"
import { CommandExecutor } from "./CommandExecutor"
import { GDriveActions } from "./GDriveActions"
import { GmailActions } from "./GmailActions"
import { PDFActions } from "./PDFActions"
import { ThreadAction } from "./ThreadAction"

export class AllActions implements ActionProvider, CommandExecutor {
  // TODO: This method is duplicated in GmailActions
  private static mergeMaps(
    map1: Map<string, Action>,
    map2: Map<string, Action>,
  ): Map<string, Action> {
    return new Map([
      ...Array.from(map1.entries()),
      ...Array.from(map2.entries()),
    ])
  }
  public gmailActions: GmailActions
  public gmailApp: GoogleAppsScript.Gmail.GmailApp
  public gdriveApp: GoogleAppsScript.Drive.DriveApp

  constructor(
    public gasContext: GoogleAppsScriptContext,
    public config: Config,
  ) {
    this.gmailApp = gasContext.gmailApp
    this.gdriveApp = gasContext.gdriveApp
    this.gmailActions = new GmailActions(this.gmailApp)
  }

  /**
   * Mark a thread as processed.
   * @param thread The thread to mark as processed.
   * @param config The global configuration.
   */
  public markThreadAsProcessed(
    thread: GoogleAppsScript.Gmail.GmailThread,
  ): boolean {
    const label = this.gmailActions.getOrCreateLabel(
      this.config.settings.processedLabel,
    )
    thread.addLabel(label)
    return true
  }

  public getActions(): Actions {
    let actions: Actions = new Actions()
    actions.set(
      "thread.markAsProcessed",
      new ThreadAction(this.markThreadAsProcessed),
    )
    actions = AllActions.mergeMaps(
      actions,
      new GDriveActions(this.gdriveApp).getActions(),
    )
    actions = AllActions.mergeMaps(
      actions,
      new GmailActions(this.gmailApp).getActions(),
    )
    actions = AllActions.mergeMaps(
      actions,
      new PDFActions(this.gdriveApp).getActions(),
    )
    return actions
  }

  public execute(command: string, gmailObject: any, args: any): void {
    const cmd = this.getActions().get(command)
    if (cmd) {
      cmd.run(gmailObject, args)
    }
  }
}
