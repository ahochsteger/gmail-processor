import { ConfigBase, Model } from "./ConfigBase"
import { GlobalConfig } from "./GlobalConfig"
import { SettingsConfig } from "./SettingsConfig"
import { ThreadConfig } from "./ThreadConfig"

/**
 * Represents a configuration for GMail2GDrive
 */
@Model
export class Config extends ConfigBase<Config> {
  /**
   * The description of the GMail2GDrive config
   */
  description = ""
  /**
   * The global configuration that defines matching for all threads as well as actions for all threads, messages or attachments.
   */
  global: GlobalConfig = new GlobalConfig()
  /**
   * The list of handler that define the way nested threads, messages or attachments are processed
   */
  handler: ThreadConfig[] = []
  /**
   * Represents a settings config that affect the way GMail2GDrive works.
   */
  settings: SettingsConfig = new SettingsConfig()
}
