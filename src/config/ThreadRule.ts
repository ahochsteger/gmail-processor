import { Command } from "./Command"
import { MessageRule } from "./MessageRule"

/**
 * {
 *     description: "Rule description",
 *     filter: "has:attachment from:example@example.com",
 *     actions: [ ... ],
 *     messagesRules: [ ... ],
 * }
 */
export class ThreadRule {
  public commands: Command[] = []
  public description: string
  public filter: string
  public messageRules: MessageRule[] = []

  constructor(public config: any) {
    this.description = config.description
    this.filter = config.filter
    for (const c of config.commands instanceof Array ? config.commands : []) {
      this.commands.push(new Command(c))
    }
    for (const c of config.messageRules instanceof Array
      ? config.messageRules
      : []) {
      this.messageRules.push(new MessageRule(c))
    }
  }
}
