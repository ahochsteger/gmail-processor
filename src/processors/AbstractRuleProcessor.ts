import { ActionProvider } from "../actions/ActionProvider"
import { Actions } from "../actions/Actions"

export class AbstractRuleProcessor implements RuleProcessor {
  public data: any
  public type = ""

  constructor(
    public gmailObject: any,
    public commandProcessor: ActionProvider,
    public childRuleProcessor: RuleProcessor,
    public childRulesName: string,
  ) {}

  public performAction(actionObj: any) {
    const allActions: Actions = this.commandProcessor.getActions()
    const action = allActions.get(actionObj.action)
    if (action) {
      action.run(this.gmailObject, actionObj.args)
    }
  }

  public performActions(actions: any[]) {
    actions.forEach((action) => {
      this.performAction(action)
    })
  }

  public matches(matchRule: [string, string]): boolean {
    Object.entries(matchRule).forEach(([key, value]) => {
      const regex = new RegExp(this.data[value])
      if (!regex.test(this.type + "." + key)) {
        return false
      }
    })
    return true
  }

  public processRule(rule: any) {
    if (this.matches(rule.matches)) {
      if (rule.get(this.childRulesName)) {
        this.childRuleProcessor.processRules(rule.get(this.childRulesName))
      }
      this.performActions(rule.actions)
    }
  }

  public processRules(rules: any[]) {
    rules.forEach((rule) => {
      this.processRule(rule)
    })
  }
}
