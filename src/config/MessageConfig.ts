import { ActionConfig } from "./ActionConfig"
import { AttachmentConfig } from "./AttachmentConfig"
import { ConfigBase, Model } from "./ConfigBase"
import { MessageMatchConfig } from "./MessageMatchConfig"

/**
 * Represents a config to handle a certain GMail message
 */
@Model
export class MessageConfig extends ConfigBase<MessageConfig> {
  /**
   * The list actions to be executed for their respective handler scopes
   */
  actions: ActionConfig[] = []
  /**
   * The description of the message handler config
   */
  description = ""
  /**
   * The list of handler that define the way attachments are processed
   */
  handler: AttachmentConfig[] = []
  /**
   * Specifies which attachments match for further processing
   */
  match = new MessageMatchConfig()
  /**
   * The type of handler
   */
  type = "messages"
}
