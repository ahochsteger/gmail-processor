import { AttachmentRule } from "./AttachmentRule"
import { Command } from "./Command"
import { MessageFlag } from "./MessageFlag"
import "reflect-metadata"
import { Type } from "class-transformer"

/**
 * {
 *     match: {
 *         from: "(.+)@example.com",
 *         subject: "Prefix - (.*) - Suffix(.*)",
 *         to: "my\.address\+(.+)@gmail.com",
 *     },
 *     is: [
 *       "starred|unstarred",
 *       "read|unread",
 *     ]
 *     commands: [ ... ],
 *     attachmentRules: [ ... ],
 * }
 */
export class MessageRule {
  @Type(() => Map<string, string>)
  public match: Map<string, string> = new Map<string, string>()
  public is: MessageFlag[] = []
  @Type(() => Command)
  public commands: Command[] = []
  @Type(() => AttachmentRule)
  public attachmentRules: AttachmentRule[] = []
}
