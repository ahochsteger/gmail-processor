import { Expose, plainToInstance } from "class-transformer"
import "reflect-metadata"

/**
 * Represents a config to perform a certain action for a GMail thread/message/attachment.
 */
export class ActionConfig {
  /**
   * The arguments for a certain action
   */
  @Expose()
  args?: { [k: string]: unknown } = {}
  /**
   * The description for the action
   */
  @Expose()
  description? = ""
  /**
   * The name of the action to be executed
   */
  @Expose()
  name?: string
}

export function jsonToActionConfig(
  json: Record<string, unknown>,
): ActionConfig {
  return plainToInstance(ActionConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  })
}
