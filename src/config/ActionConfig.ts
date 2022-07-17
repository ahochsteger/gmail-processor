import { ConfigBase, Model } from "./ConfigBase"
import { HandlerType } from "./ConfigTypes"

/**
 * Represents a config to perform a certain action for a GMail thread/message/attachment.
 */
@Model
export class ActionConfig extends ConfigBase<ActionConfig> {
  /**
   * The arguments for a certain action
   */
  args?: {
    [k: string]: unknown;
  }
  /**
   * The description for the action
   */
  description = ""
  /**
   * The name of the action to be executed
   */
  name?: string
  /**
   * The handler type to which this action is bound to (defaults to the handler type where the action is defined)
   */
  scope?: HandlerType
}
