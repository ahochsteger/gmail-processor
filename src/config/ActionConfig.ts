import { Expose, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { HandlerType } from "./ConfigTypes"

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
  /**
   * The handler type to which this action is bound to (defaults to the handler type where the action is defined)
   */
  @Expose()
  scope?: HandlerType
}

export function jsonToActionConfig(
  json: Record<string, unknown>,
): ActionConfig {
  return plainToInstance(ActionConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  })
}
