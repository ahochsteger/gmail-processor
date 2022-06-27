import { Command } from "./Command"
import { MessageRule } from "./MessageRule"
import { Type } from "class-transformer"

/**
 * {
 *     description: "Rule description",
 *     filter: "has:attachment from:example@example.com",
 *     actions: [ ... ],
 *     messagesRules: [ ... ],
 * }
 */
export class ThreadRule {
  @Type(() => Command)
  public commands: Command[] = []
  public description = ""
  public filter = ""
  @Type(() => MessageRule)
  public messageRules: MessageRule[] = []
}
