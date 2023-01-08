import { Type } from "class-transformer"
import { ActionConfig } from "./ActionConfig"
import { AttachmentMatchConfig } from "./AttachmentMatchConfig"

/**
 * Represents a config to handle a certain GMail attachment
 */
export class AttachmentConfig {
  /**
   * The list actions to be executed for their respective handler scopes
   */
  @Type(() => ActionConfig)
  actions: ActionConfig[] = []
  /**
   * The description of the attachment handler config
   */
  description? = ""
  /**
   * Specifies which attachments match for further processing
   */
  @Type(() => AttachmentMatchConfig)
  match = new AttachmentMatchConfig()
  /**
   * The unique name of the attachment config (will be generated if not set)
   */
  name? = ""
  /**
   * The type of handler
   */
  type = "attachments"
}
