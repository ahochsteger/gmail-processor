import { Action } from "./Action"
import { ActionProvider } from "./ActionProvider"
import { Actions } from "./Actions"
import { GmailMessageActions } from "./GmailMessageActions"
import { GmailThreadActions } from "./GmailThreadActions"

export class GmailActions implements ActionProvider {
  // TODO: This method is duplicated in AllActions
  private static mergeMaps(
    map1: Map<string, Action>,
    map2: Map<string, Action>,
  ): Map<string, Action> {
    return new Map([
      ...Array.from(map1.entries()),
      ...Array.from(map2.entries()),
    ])
  }

  constructor(public gmailApp: GoogleAppsScript.Gmail.GmailApp) {}

  /**
   * Returns the label with the given name or creates it if not existing.
   */
  public getOrCreateLabel(labelName: string) {
    let label = this.gmailApp.getUserLabelByName(labelName)
    if (label == null) {
      label = this.gmailApp.createLabel(labelName)
    }
    return label
  }

  public getActions(): Actions {
    let actions = new Actions()
    actions = GmailActions.mergeMaps(
      actions,
      new GmailMessageActions().getActions(),
    )
    actions = GmailActions.mergeMaps(
      actions,
      new GmailThreadActions().getActions(),
    )
    return actions
  }
}
