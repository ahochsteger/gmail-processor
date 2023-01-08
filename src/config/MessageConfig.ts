import { Type } from "class-transformer"
import { ActionConfig } from "./ActionConfig"
import { AttachmentConfig } from "./AttachmentConfig"
import { MessageMatchConfig } from "./MessageMatchConfig"

/**
 * Represents a config to handle a certain GMail message
 */
export class MessageConfig {
  /**
   * The list actions to be executed for their respective handler scopes
   */
  actions: ActionConfig[] = []
  /**
   * The description of the message handler config
   */
  description? = ""
  /**
   * The list of handler that define the way attachments are processed
   */
  @Type(() => AttachmentConfig)
  handler: AttachmentConfig[] = []
  /**
   * Specifies which attachments match for further processing
   */
  @Type(() => MessageMatchConfig)
  match = new MessageMatchConfig()
  /**
   * The unique name of the message config (will be generated if not set)
   */
  name? = ""
  /**
   * The type of handler
   */
  type = "messages"
}
