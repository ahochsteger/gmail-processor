import { Type } from "class-transformer"
import { ActionConfig } from "./ActionConfig"
import { MessageConfig } from "./MessageConfig"
import { ThreadMatchConfig } from "./ThreadMatchConfig"

/**
 * Represents a config handle a certain GMail thread
 */
export class ThreadConfig {
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
  @Type(() => MessageConfig)
  handler: MessageConfig[] = []
  /**
   * Specifies which threads match for further processing
   */
  @Type(() => ThreadMatchConfig)
  match = new ThreadMatchConfig()
  /**
   * The unique name of the thread config (will be generated if not set)
   */
  name = ""
  /**
   * The type of handler
   */
  type = "threads"
}
