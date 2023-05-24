import {
  Expose,
  Type,
  instanceToPlain,
  plainToInstance,
} from "class-transformer"
import "reflect-metadata"
import { RequiredDeep } from "../utils/UtilityTypes"
import { ThreadActionConfig } from "./ActionConfig"
import { ThreadMatchConfig } from "./ThreadMatchConfig"
import { PartialDeep } from "type-fest"

/**
 * The global configuration that defines matching for all threads as well as actions for all threads, messages or attachments.
 */
export class GlobalConfig {
  /**
   * The global thread matching parameters applied in addition to each thread configuration
   */
  @Expose()
  @Type(() => ThreadMatchConfig)
  match? = new ThreadMatchConfig()
  /**
   * The list of global actions that are always executed for their respective handler scopes
   */
  @Expose()
  @Type(() => ThreadActionConfig)
  actions?: ThreadActionConfig[] = []
}

export type RequiredGlobalConfig = RequiredDeep<GlobalConfig>

export function jsonToGlobalConfig(
  json: PartialDeep<GlobalConfig>,
): RequiredGlobalConfig {
  return plainToInstance(GlobalConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredGlobalConfig
}

export function globalConfigToJson<T = GlobalConfig>(
  config: T,
  withDefaults = false,
): PartialDeep<GlobalConfig> {
  return instanceToPlain(config, {
    exposeDefaultValues: withDefaults,
  })
}

export function newGlobalConfig(
  json: PartialDeep<GlobalConfig> = {},
): RequiredGlobalConfig {
  return jsonToGlobalConfig(json)
}
