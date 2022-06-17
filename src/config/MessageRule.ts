import { AttachmentRule } from "./AttachmentRule"
import { Command } from "./Command"

/**
 *
 * {
 *     match: {
 *         from: "(.+)@example.com",
 *         subject: "Prefix - (.*) - Suffix(.*)",
 *         to: "my\.address\+(.+)@gmail.com",
 *     },
 *     commands: [ ... ],
 *     attachmentRules: [ ... ],
 * }
 */
export class MessageRule {
  private static objToStrMap(obj: any): Map<string, any> {
    const strMap = new Map<string, any>()
    if (!obj) {
      return strMap
    }
    for (const k of Object.keys(obj)) {
      strMap.set(k, obj[k])
    }
    return strMap
  }

  public match: Map<string, string>
  public commands: Command[] = []
  public attachmentRules: AttachmentRule[] = []

  constructor(public config: any) {
    this.match = MessageRule.objToStrMap(config.match)
    // this.match = config.match instanceof Object
    //     ? new Map<string, string>(config.match)
    //     : new Map<string, string>()
    for (const c of config.commands instanceof Array ? config.commands : []) {
      this.commands.push(new Command(c))
    }
    for (const c of config.attachmentRules instanceof Array
      ? config.attachmentRules
      : []) {
      this.attachmentRules.push(new AttachmentRule(c))
    }
  }
}
