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
import { MessageMatchConfig } from "./MessageMatchConfig"

/**
 * Represents a config to handle a certain GMail message
 */
export class MessageConfig {
  /**
   * The list actions to be executed for their respective handler scopes
   */
  @Expose()
  actions?: ActionConfig[] = []
  /**
   * The description of the message handler config
   */
  @Expose()
  description? = ""
  /**
   * The list of handler that define the way attachments are processed
   */
  @Expose()
  @Type(() => AttachmentConfig)
  attachments?: AttachmentConfig[] = []
  /**
   * Specifies which attachments match for further processing
   */
  @Expose()
  @Type(() => MessageMatchConfig)
  match? = new MessageMatchConfig()
  /**
   * The unique name of the message config (will be generated if not set)
   */
  @Expose()
  name? = ""
}

export type RequiredMessageConfig = RequiredDeep<MessageConfig>

export function jsonToMessageConfig(
  json: Record<string, unknown>,
): RequiredMessageConfig {
  return plainToInstance(MessageConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredMessageConfig
}

export function messageConfigToJson<T = MessageConfig>(
  config: T,
  withDefaults = false,
): Record<string, unknown> {
  return instanceToPlain(config, {
    exposeDefaultValues: withDefaults,
  })
}

export function newMessageConfig(
  json: Record<string, unknown> = {},
): RequiredMessageConfig {
  return jsonToMessageConfig(json)
}
