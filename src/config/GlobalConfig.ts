import { ActionConfig } from "./ActionConfig"
import { ConfigBase, Model } from "./ConfigBase"
import { ThreadMatchConfig } from "./ThreadMatchConfig"

/**
 * The global configuration that defines matching for all threads as well as actions for all threads, messages or attachments.
 */
@Model
export class GlobalConfig extends ConfigBase<GlobalConfig> {
  /**
   * The global thread matching parameters applied in addition to each thread configuration
   */
  match = new ThreadMatchConfig()
  /**
   * The list of global actions that are always executed for their respective handler scopes
   */
  actions: ActionConfig[] = []
  /**
   * The type of handler
   */
  type = "global"
}
