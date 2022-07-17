import { ActionConfig } from "./ActionConfig"
import { AttachmentMatchConfig } from "./AttachmentMatchConfig"
import { ConfigBase, Model } from "./ConfigBase"

/**
 * Represents a config to handle a certain GMail attachment
 */
@Model
export class AttachmentConfig extends ConfigBase<AttachmentConfig> {
  /**
   * The list actions to be executed for their respective handler scopes
   */
  actions: ActionConfig[] = []
  /**
   * The description of the attachment handler config
   */
  description = ""
  /**
   * Specifies which attachments match for further processing
   */
  match = new AttachmentMatchConfig()
  /**
   * The type of handler
   */
  type = "attachments"
}
