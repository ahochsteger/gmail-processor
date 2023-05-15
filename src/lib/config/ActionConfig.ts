import { Expose, instanceToPlain, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { RequiredDeep } from "../utils/UtilityTypes"

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
  name = ""
}

export type RequiredActionConfig = RequiredDeep<ActionConfig>

export function jsonToActionConfig(
  json: Record<string, unknown>,
): RequiredActionConfig {
  return plainToInstance(ActionConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredActionConfig
}

export function actionConfigToJson<T = ActionConfig>(
  config: T,
  withDefaults = false,
): Record<string, unknown> {
  return instanceToPlain(config, {
    exposeDefaultValues: withDefaults,
  })
}

export function newActionConfig(
  json: Record<string, unknown> = {},
): RequiredActionConfig {
  return jsonToActionConfig(json)
}
