import {
  Expose,
  Type,
  instanceToPlain,
  plainToInstance,
} from "class-transformer"
import "reflect-metadata"
import { RequiredDeep } from "../utils/UtilityTypes"
import { ActionConfig } from "./ActionConfig"
import { AttachmentConfig } from "./AttachmentConfig"
import { MessageConfig } from "./MessageConfig"
import { ThreadMatchConfig } from "./ThreadMatchConfig"

/**
 * Represents a config handle a certain GMail thread
 */
export class ThreadConfig {
  /**
   * The list actions to be executed for their respective handler scopes
   */
  @Expose()
  actions?: ActionConfig[] = []
  /**
   * The description of the thread handler config
   */
  @Expose()
  description? = ""
  /**
   * The list of handler that define the way nested messages or attachments are processed
   */
  @Expose()
  @Type(() => MessageConfig)
  messages?: MessageConfig[] = []
  /**
   * The list of handler that define the way attachments are processed
   */
  @Expose()
  @Type(() => AttachmentConfig)
  attachments?: AttachmentConfig[] = []
  /**
   * Specifies which threads match for further processing
   */
  @Expose()
  @Type(() => ThreadMatchConfig)
  match? = new ThreadMatchConfig()
  /**
   * The unique name of the thread config (will be generated if not set)
   */
  @Expose()
  name? = ""
}

export type RequiredThreadConfig = RequiredDeep<ThreadConfig>

export function jsonToThreadConfig(
  json: Record<string, unknown>,
): RequiredThreadConfig {
  return plainToInstance(ThreadConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredThreadConfig
}

export function threadConfigToJson<T = ThreadConfig>(
  config: T,
  withDefaults = false,
): Record<string, unknown> {
  return instanceToPlain(config, {
    exposeDefaultValues: withDefaults,
  })
}

export function newThreadConfig(
  json: Record<string, unknown> = {},
): RequiredThreadConfig {
  return jsonToThreadConfig(json)
}
