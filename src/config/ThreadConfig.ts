import { ActionConfig } from "./ActionConfig"
import { ConfigBase, Model } from "./ConfigBase"
import { MessageConfig } from "./MessageConfig"
import { ThreadMatchConfig } from "./ThreadMatchConfig"

/**
 * Represents a config handle a certain GMail thread
 */
@Model
export class ThreadConfig extends ConfigBase<ThreadConfig> {
  /**
   * The list actions to be executed for their respective handler scopes
   */
  actions: ActionConfig[] = []
  /**
   * The description of the thread handler config
   */
  description = ""
  /**
   * The list of handler that define the way nested messages or attachments are processed
   */
  handler: MessageConfig[] = []
  /**
   * Specifies which threads match for further processing
   */
  match = new ThreadMatchConfig()
  /**
   * The type of handler
   */
  type = "threads"
}
